import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, type Timestamp } from 'firebase/firestore'
import GeoMapDemo from '@/components/analytics/GeoData'
import GenerateReport from '@/components/analytics/GenerateReport'
import ResponseChart from '@/components/analytics/ResponseChart'
import ChartTypeSelector from '@/components/analytics/ChartTypeSelector'
import SimpleBarChart from '@/components/analytics/BarChart'
import SimplePieChart from '@/components/analytics/PieChart'
import CompareLineChart from '@/components/analytics/CompareLineChart'
import { FilterBar } from '@/components/analytics/FilterBar'
import { SearchCombobox } from '@/components/analytics/SearchCombobox'
import { FilterChips } from '@/components/analytics/FilterChips'
import { db } from '@/firebase/config'
import { Button } from '@/components/ui/button'
import type { ChartType } from '@/types/chartTypes'
import type {
  FilterState,
  ActiveFilter,
  School,
  RespondentGroup,
  QuestionType,
  SurveyType,
} from '@/types/analytics'
import { useAuth } from '@/contexts/AuthContext'

type SurveyQuestion = {
  question_id: string
  text?: string
  questionType?: string
}

type FirestoreSurvey = {
  title?: string
  type?: string
  questions?: SurveyQuestion[]
  districtId?: string
  schoolId?: string
  status?: string
}

type FirestoreAnswer = {
  question_id?: string
  value?: string | number
}

type FirestoreResponse = {
  answers?: FirestoreAnswer[]
  school_id?: string
  respondent_group?: string
  surveyTitle?: string
  survey_id?: string
  submittedAt?: Timestamp | Date | string | null
}

type ResponseRecord = {
  id: string
  questionId: string
  question: string
  surveyTitle: string
  surveyType: string | null
  surveyID: string
  questionType: string | null
  school: string | null
  respondentGroup: string | null
  date: string | null
  answerValue: string
}

type ChartEntry = {
  questionId: string
  question: string
  surveyTitle: string
  chartData: { name: string; value: number }[]
}

type CachedData = {
  responses: ResponseRecord[]
  cachedAt: number
}

type SurveyInfo = {
  id: string
  title: string
  districtId: string | null
  schoolId: string | null
  status: string | null
  questionNames: string[]
}

type PermissionContext = {
  role: string | null
  schoolId: string | null
  districtId: string | null
}

const CACHE_KEY = 'nscc_analytics_responses' // key used to store and retrieve data from localstorage
const CACHE_TTL_MS = 15 * 60 * 1000 // resets cached data every 15 minutes

function loadFromCache(): ResponseRecord[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as CachedData
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return parsed.responses
  } catch {
    return null
  }
}

function saveToCache(responses: ResponseRecord[]) {
  const data: CachedData = { responses, cachedAt: Date.now() }
  localStorage.setItem(CACHE_KEY, JSON.stringify(data))
}

const PAGE_SIZE = 4

const defaultFilterState: FilterState = {
  school: null,
  respondentGroup: null,
  compareBy: null,
  questionType: null,
  surveyType: null,
  dateFrom: null,
  dateTo: null,
  searchQuery: '',
}

const formatLabel = (value: string) =>
  value.replace(/[_-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

const extractDateString = (
  value: Timestamp | Date | string | null | undefined
) => {
  if (!value) return null
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime())
      ? null
      : parsed.toISOString().split('T')[0]
  }
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }
  if ('toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toISOString().split('T')[0]
  }
  return null
}

type ComparisonChart = {
  questionText: string
  data: Record<string, string | number>[]
  lines: { key: string; color: string }[]
}

const COMPARE_COLORS = [
  '#F59E1E',
  '#269ACF',
  '#7C3AED',
  '#16A34A',
  '#DC2626',
  '#0891B2',
  '#DB2777',
  '#65A30D',
  '#9333EA',
  '#EA580C',
]

function buildComparisonCharts(
  responses: ResponseRecord[],
  selectedSurveys: SurveyInfo[]
): ComparisonChart[] {
  const selectedIds = new Set(selectedSurveys.map((s) => s.id))
  const relevantResponses = responses.filter((r) => selectedIds.has(r.surveyID))

  // one "issued" date per survey = earliest response date seen for that survey
  const surveyEarliestDate = new Map<string, string>()
  relevantResponses.forEach((r) => {
    if (!r.date) return
    const existing = surveyEarliestDate.get(r.surveyID)
    if (!existing || r.date < existing) {
      surveyEarliestDate.set(r.surveyID, r.date)
    }
  })

  // detect collisions: if two selected surveys land on the same date,
  // disambiguate by appending the survey title so each still gets its own x-axis point
  const dateCounts = new Map<string, number>()
  selectedSurveys.forEach((survey) => {
    const date = surveyEarliestDate.get(survey.id)
    if (!date) return
    dateCounts.set(date, (dateCounts.get(date) ?? 0) + 1)
  })

  const surveyDateLabel = new Map<string, string>()
  selectedSurveys.forEach((survey) => {
    const date = surveyEarliestDate.get(survey.id)
    if (!date) {
      surveyDateLabel.set(survey.id, 'Unknown')
      return
    }
    const isCollision = (dateCounts.get(date) ?? 0) > 1
    surveyDateLabel.set(
      survey.id,
      isCollision ? `${date} (${survey.title})` : date
    )
  })

  // question texts present in every selected survey
  const questionTextSets = selectedSurveys.map((s) => new Set(s.questionNames))
  const [firstSet, ...restSets] = questionTextSets
  const sharedQuestionTexts = Array.from(firstSet).filter((text) =>
    restSets.every((set) => set.has(text))
  )

  return sharedQuestionTexts.map((questionText) => {
    const questionResponses = relevantResponses.filter(
      (r) => r.question === questionText
    )

    const answerOptions = Array.from(
      new Set(questionResponses.map((r) => r.answerValue))
    ).sort()

    // group by survey's issued date label (disambiguated if needed)
    const dateMap = new Map<string, Map<string, number>>()
    const dateTotals = new Map<string, number>()

    questionResponses.forEach((r) => {
      const date = surveyDateLabel.get(r.surveyID) ?? 'Unknown'
      if (!dateMap.has(date)) dateMap.set(date, new Map())
      const answerCounts = dateMap.get(date)!
      answerCounts.set(
        r.answerValue,
        (answerCounts.get(r.answerValue) ?? 0) + 1
      )
      dateTotals.set(date, (dateTotals.get(date) ?? 0) + 1)
    })

    const sortedDates = Array.from(dateMap.keys()).sort()

    const data = sortedDates.map((date) => {
      const point: Record<string, string | number> = { date }
      const answerCounts = dateMap.get(date)!
      const total = dateTotals.get(date) ?? 0

      answerOptions.forEach((option) => {
        const count = answerCounts.get(option) ?? 0
        point[option] = total > 0 ? Math.round((count / total) * 100) : 0
      })

      return point
    })

    const lines = answerOptions.map((option, i) => ({
      key: option,
      color: COMPARE_COLORS[i % COMPARE_COLORS.length],
    }))

    return { questionText, data, lines }
  })
}

const initialCache = loadFromCache()

export default function Analytics() {
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [responses, setResponses] = useState<ResponseRecord[]>(
    initialCache ?? []
  )
  const [surveys, setSurveys] = useState<SurveyInfo[]>([])
  const [filters, setFilters] = useState<FilterState>(defaultFilterState)
  const [loading, setLoading] = useState(initialCache === null)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExport] = useState(false)

  useEffect(() => {
    let isMounted = true
    const hasCachedData = responses.length > 0

    const fetchAnalyticsData = async () => {
      if (!hasCachedData) {
        setLoading(true)
      }
      setError(null)

      try {
        const surveySnap = await getDocs(collection(db, 'surveys'))
        const responseRecords: ResponseRecord[] = []
        const surveysInfo: SurveyInfo[] = []
        for (const surveyDoc of surveySnap.docs) {
          const data = surveyDoc.data() as FirestoreSurvey
          const surveyTitle = data.title ?? 'Untitled Survey'
          const surveyType = data.type ?? null

          const surveyQuestions = new Map<
            string,
            {
              text: string
              surveyTitle: string
              surveyType: string | null
              questionType: string | null
            }
          >()

          data.questions?.forEach((question) => {
            if (!question.question_id) return
            surveyQuestions.set(question.question_id, {
              text: question.text ?? question.question_id,
              surveyTitle,
              surveyType,
              questionType: question.questionType ?? 'multiple-choice',
            })
          })

          //getting survey info for compare surveys
          surveysInfo.push({
            id: surveyDoc.id,
            title: surveyTitle,
            districtId: data.districtId ?? null,
            schoolId: data.schoolId ?? null,
            status: data.status ?? null,
            questionNames: Array.from(surveyQuestions.values()).map(
              (q) => q.text
            ),
          })

          const responseSnap = await getDocs(
            collection(db, 'surveys', surveyDoc.id, 'responses')
          )
          responseSnap.docs.forEach((doc) => {
            const data = doc.data() as FirestoreResponse
            const date = extractDateString(data.submittedAt)
            const school = data.school_id ?? null
            const respondentGroup = data.respondent_group ?? 'students'

            data.answers?.forEach((answer, index) => {
              if (!answer.question_id) return
              const questionMetadata = surveyQuestions.get(answer.question_id)

              responseRecords.push({
                id: `${doc.id}-${answer.question_id}-${index}`,
                questionId: answer.question_id,
                question: questionMetadata?.text ?? answer.question_id,
                surveyTitle:
                  questionMetadata?.surveyTitle ??
                  data.surveyTitle ??
                  'Unknown Survey',
                surveyID: surveyDoc.id,
                surveyType: questionMetadata?.surveyType ?? null,
                questionType: questionMetadata?.questionType ?? null,
                school,
                respondentGroup,
                date,
                answerValue:
                  typeof answer.value === 'number'
                    ? String(answer.value)
                    : (answer.value as string) || 'No response',
              })
            })
          })
        }
        if (isMounted) {
          saveToCache(responseRecords)
          setResponses(responseRecords)
          setSurveys(surveysInfo)
        }
      } catch (err) {
        console.error(err)
        if (isMounted && !hasCachedData) {
          setError('Unable to load survey analytics right now.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchAnalyticsData()
    return () => {
      isMounted = false
    }
  }, [])
  const getPermSurveys = (surveys: SurveyInfo[], auth: PermissionContext) => {
    const published = surveys.filter((survey) => survey.status == 'Published')
    console.log(published)
    if (auth.role === 'super_admin') {
      return published
    }
    if (auth.districtId == null && auth.schoolId == null) {
      return []
    }
    return published.filter((survey) => {
      const schoolMatches =
        auth.schoolId == null || survey.schoolId === auth.schoolId
      const districtMatches =
        auth.districtId == null || survey.districtId === auth.districtId

      return schoolMatches && districtMatches
    })
  }

  const { role, schoolId, districtId } = useAuth()

  const permittedSurveys = useMemo(
    () => getPermSurveys(surveys, { role, schoolId, districtId }),
    [surveys, role, schoolId, districtId]
  )

  const filterOptions = useMemo(() => {
    const schoolMap = new Map<string, string>()
    const respondentGroupMap = new Map<string, string>()
    const questionTypeMap = new Map<string, string>()
    const surveyTypeMap = new Map<string, string>()
    const questionMap = new Map<string, string>()

    responses.forEach((response) => {
      if (response.school) {
        schoolMap.set(response.school, formatLabel(response.school))
      }
      if (response.respondentGroup) {
        respondentGroupMap.set(
          response.respondentGroup,
          formatLabel(response.respondentGroup)
        )
      }
      if (response.questionType) {
        questionTypeMap.set(
          response.questionType,
          formatLabel(response.questionType)
        )
      }
      if (response.surveyType) {
        surveyTypeMap.set(response.surveyType, formatLabel(response.surveyType))
      }
      if (response.question) {
        questionMap.set(response.question, response.question)
      }
    })

    const schools: School[] = Array.from(schoolMap.entries()).map(
      ([id, name]) => ({
        id,
        name,
      })
    )
    const respondentGroups: RespondentGroup[] = Array.from(
      respondentGroupMap.entries()
    ).map(([id, name]) => ({
      id,
      name,
    }))
    const questionTypes: QuestionType[] = Array.from(
      questionTypeMap.entries()
    ).map(([id, name]) => ({
      id,
      name,
    }))
    const surveyTypes: SurveyType[] = Array.from(surveyTypeMap.entries()).map(
      ([id, name]) => ({
        id,
        name,
      })
    )
    const questions = Array.from(questionMap.entries()).map(([id, name]) => ({
      id,
      name,
    }))

    const compareBy = permittedSurveys.map((survey) => ({
      id: survey.id,
      name: survey.title,
    }))

    return {
      schools,
      respondentGroups,
      questionTypes,
      surveyTypes,
      questions,
      compareBy,
    }
  }, [responses, permittedSurveys])

  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSearchChange = (id: string | null) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: id ?? '',
    }))
  }

  const handleRemoveFilter = (key: keyof FilterState) => {
    setFilters((prev) => {
      if (key === 'searchQuery') {
        return { ...prev, searchQuery: '' }
      }
      if (key === 'dateFrom' || key === 'dateTo') {
        return { ...prev, dateFrom: null, dateTo: null }
      }
      return { ...prev, [key]: null }
    })
  }

  const optionLabelMaps = useMemo(
    () => ({
      school: new Map(
        filterOptions.schools.map((opt) => [opt.id, opt.name] as const)
      ),
      respondentGroup: new Map(
        filterOptions.respondentGroups.map((opt) => [opt.id, opt.name] as const)
      ),
      questionType: new Map(
        filterOptions.questionTypes.map((opt) => [opt.id, opt.name] as const)
      ),
      surveyType: new Map(
        filterOptions.surveyTypes.map((opt) => [opt.id, opt.name] as const)
      ),
    }),
    [filterOptions]
  )

  const activeFilters: ActiveFilter[] = useMemo(() => {
    const list: ActiveFilter[] = []
    if (filters.school) {
      list.push({
        key: 'school',
        label: 'School',
        value: optionLabelMaps.school.get(filters.school) ?? filters.school,
      })
    }
    if (filters.respondentGroup) {
      list.push({
        key: 'respondentGroup',
        label: 'Respondent Group',
        value:
          optionLabelMaps.respondentGroup.get(filters.respondentGroup) ??
          filters.respondentGroup,
      })
    }
    if (filters.questionType) {
      list.push({
        key: 'questionType',
        label: 'Question Type',
        value:
          optionLabelMaps.questionType.get(filters.questionType) ??
          filters.questionType,
      })
    }
    if (filters.surveyType) {
      list.push({
        key: 'surveyType',
        label: 'Survey Type',
        value:
          optionLabelMaps.surveyType.get(filters.surveyType) ??
          filters.surveyType,
      })
    }
    if (filters.dateFrom && filters.dateTo) {
      list.push({
        key: 'dateFrom',
        label: 'Date Range',
        value: `${filters.dateFrom} to ${filters.dateTo}`,
      })
    }
    return list
  }, [filters, optionLabelMaps])

  const filteredResponses = useMemo(() => {
    return responses.filter((response) => {
      if (filters.school && response.school !== filters.school) {
        return false
      }
      if (
        filters.respondentGroup &&
        response.respondentGroup !== filters.respondentGroup
      ) {
        return false
      }
      if (
        filters.questionType &&
        response.questionType !== filters.questionType
      ) {
        return false
      }
      if (filters.surveyType && response.surveyType !== filters.surveyType) {
        return false
      }
      if (filters.dateFrom) {
        if (!response.date || response.date < filters.dateFrom) {
          return false
        }
      }
      if (filters.dateTo) {
        if (!response.date || response.date > filters.dateTo) {
          return false
        }
      }
      if (
        filters.searchQuery &&
        !response.question
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [responses, filters])

  const charts = useMemo(() => {
    const grouped = new Map<string, ChartEntry>()

    filteredResponses.forEach((response) => {
      if (!grouped.has(response.questionId)) {
        grouped.set(response.questionId, {
          questionId: response.questionId,
          question: response.question,
          surveyTitle: response.surveyTitle,
          chartData: [],
        })
      }

      const entry = grouped.get(response.questionId)
      if (!entry) return

      const label = response.answerValue || 'No response'
      const existing = entry.chartData.find((item) => item.name === label)
      if (existing) {
        existing.value += 1
      } else {
        entry.chartData.push({ name: label, value: 1 })
      }
    })

    return Array.from(grouped.values()).map((entry) => ({
      ...entry,
      chartData: entry.chartData.sort((a, b) => a.name.localeCompare(b.name)),
    }))
  }, [filteredResponses])

  const compareError = useMemo(() => {
    if (!filters.compareBy) return null

    const selectedIds = filters.compareBy.split(',').filter(Boolean)
    if (selectedIds.length < 2) return null

    const selectedSurveys = permittedSurveys.filter((s) =>
      selectedIds.includes(s.id)
    )
    if (selectedSurveys.length < 2) return null

    const [first, ...rest] = selectedSurveys
    const firstQuestionTexts = new Set(first.questionNames)

    const hasMatch = rest.every((survey) =>
      survey.questionNames.some((text) => firstQuestionTexts.has(text))
    )

    return hasMatch
      ? null
      : 'Surveys are not the same. Please select new surveys to compare'
  }, [filters.compareBy, permittedSurveys])

  const comparisonCharts = useMemo(() => {
    if (!filters.compareBy) return []

    const selectedIds = filters.compareBy.split(',').filter(Boolean)
    if (selectedIds.length < 2) return []

    const selectedSurveys = permittedSurveys.filter((s) =>
      selectedIds.includes(s.id)
    )
    if (selectedSurveys.length < 2 || compareError) return []

    return buildComparisonCharts(responses, selectedSurveys)
  }, [filters.compareBy, permittedSurveys, responses, compareError])

  const [page, setPage] = useState(1)
  const totalPages = charts.length ? Math.ceil(charts.length / PAGE_SIZE) : 0
  const paginatedCharts = charts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (!charts.length) {
      setPage(1)
      return
    }
    const maxPage = Math.max(1, Math.ceil(charts.length / PAGE_SIZE))
    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [charts, page])

  const ChartComponent = useMemo(() => {
    switch (chartType) {
      case 'pie':
        return SimplePieChart
      case 'bar':
      default:
        return SimpleBarChart
    }
  }, [chartType])

  const renderContent = () => {
    if (loading) {
      return (
        <p className="font-body text-body mt-6" data-testid="analytics-loading">
          Loading survey responses...
        </p>
      )
    }

    if (error) {
      return (
        <p
          className="font-body text-red-600 mt-6"
          data-testid="analytics-error"
        >
          {error}
        </p>
      )
    }

    if (compareError) {
      return (
        <p
          className="font-body text-red-600 mt-6"
          data-testid="analytics-compare-error"
        >
          {compareError}
        </p>
      )
    }

    if (comparisonCharts.length > 0) {
      return (
        <div
          className="mt-4 bg-background p-4 rounded-2xl"
          id="analyticsInsight"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background p-4 rounded-2xl">
            {comparisonCharts.map((chart) => (
              <CompareLineChart
                key={chart.questionText}
                title={chart.questionText}
                data={chart.data}
                lines={chart.lines}
              />
            ))}
          </div>
        </div>
      )
    }
    if (!responses.length) {
      return (
        <p className="font-body text-body mt-6" data-testid="analytics-empty">
          No responses available yet. Once responses are submitted they will be
          summarized here.
        </p>
      )
    }

    if (!charts.length) {
      return (
        <p
          className="font-body text-body mt-6"
          data-testid="analytics-filter-empty"
        >
          No charts match the current filters.
        </p>
      )
    }

    return (
      <div className="mt-4 bg-background p-4 rounded-2xl" id="analyticsInsight">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <ChartTypeSelector value={chartType} onChange={setChartType} />

          <div className="flex items-center">
            <GenerateReport setExport={setExport} chartsData={charts} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background p-4 rounded-2xl">
          {(exporting ? charts : paginatedCharts).map((chart) => (
            <ResponseChart
              key={chart.questionId}
              chart={chart}
              filteredResponses={filteredResponses}
              ChartComponent={ChartComponent}
            />
          ))}
        </div>
        {totalPages > 1 && !exporting && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="hover:bg-secondary/20 cursor-pointer"
            >
              Previous
            </Button>
            <span className="text-sm text-body">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="hover:bg-secondary/20 cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="font-heading text-4xl font-bold text-heading mb-1">
          Survey Analytics
        </h1>
        <p className="font-body text-lg text-body">
          View data visualizations and insights from survey responses.
        </p>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        options={filterOptions}
      />

      <div className="flex flex-wrap items-start gap-4">
        <SearchCombobox
          value={filters.searchQuery || null}
          onChange={handleSearchChange}
          options={filterOptions.questions}
          placeholder="Search a question"
          className="w-[240px]"
        />
        <FilterChips
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
        />
      </div>

      {renderContent()}

      <div>
        <h2 className="font-heading text-2xl font-bold text-heading mb-1">
          Geographic Response Map
        </h2>
        <p className="font-body text-base text-body mb-4">
          View survey response distribution and average scores by school
          location.
        </p>
        <GeoMapDemo />
      </div>
    </div>
  )
}
