import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, type Timestamp } from 'firebase/firestore'
import GenerateReport from '@/components/analytics/GenerateReport'
import ResponseChart from '@/components/analytics/ResponseChart'
import ChartTypeSelector from '@/components/analytics/ChartTypeSelector'
import SimpleBarChart from '@/components/analytics/BarChart'
import SimplePieChart from '@/components/analytics/PieChart'
import { FilterBar } from '@/components/analytics/FilterBar'
import { SearchInput } from '@/components/analytics/SearchInput'
import { FilterChips } from '@/components/analytics/FilterChips'
import { db } from '@/firebase/config'
import type { ChartType } from '@/types/chartTypes'
import type {
  FilterState,
  ActiveFilter,
  School,
  RespondentGroup,
  QuestionType,
  SurveyType,
} from '@/types/analytics'

type SurveyQuestion = {
  question_id: string
  text?: string
  questionType?: string
}

type FirestoreSurvey = {
  title?: string
  type?: string
  questions?: SurveyQuestion[]
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

export default function Analytics() {
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [responses, setResponses] = useState<ResponseRecord[]>([])
  const [filters, setFilters] = useState<FilterState>(defaultFilterState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchAnalyticsData = async () => {
      setLoading(true)
      setError(null)

      try {
        const [surveySnap, responseSnap] = await Promise.all([
          getDocs(collection(db, 'surveys')),
          getDocs(collection(db, 'responses')),
        ])

        const surveyQuestions = new Map<
          string,
          {
            text: string
            surveyTitle: string
            surveyType: string | null
            questionType: string | null
          }
        >()

        surveySnap.docs.forEach((doc) => {
          const data = doc.data() as FirestoreSurvey
          const surveyTitle = data.title ?? 'Untitled Survey'
          const surveyType = data.type ?? null
          data.questions?.forEach((question) => {
            if (!question.question_id) return
            surveyQuestions.set(question.question_id, {
              text: question.text ?? question.question_id,
              surveyTitle,
              surveyType,
              questionType: question.questionType ?? 'multiple-choice',
            })
          })
        })

        const responseRecords: ResponseRecord[] = []

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

        if (isMounted) {
          setResponses(responseRecords)
        }
      } catch (err) {
        console.error(err)
        if (isMounted) {
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

  const filterOptions = useMemo(() => {
    const schoolMap = new Map<string, string>()
    const respondentGroupMap = new Map<string, string>()
    const questionTypeMap = new Map<string, string>()
    const surveyTypeMap = new Map<string, string>()

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

    return {
      schools,
      respondentGroups,
      questionTypes,
      surveyTypes,
    }
  }, [responses])

  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: value,
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
      <div className="h-[500px] overflow-y-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background p-4">
          {charts.map((chart) => (
            <ResponseChart
              key={chart.questionId}
              question={`${chart.surveyTitle} • ${chart.question}`}
              ChartComponent={ChartComponent}
              chartData={chart.chartData}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
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
        <SearchInput
          value={filters.searchQuery}
          onChange={handleSearchChange}
        />
        <FilterChips
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ChartTypeSelector value={chartType} onChange={setChartType} />
        <GenerateReport />
      </div>

      {renderContent()}
    </div>
  )
}
