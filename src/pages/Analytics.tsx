import GenerateReport from '@/components/analytics/GenerateReport'
import ResponseChart from '@/components/analytics/ResponseChart'
import ChartTypeSelector from '@/components/analytics/ChartTypeSelector'
import { FilterBar } from '@/components/analytics/FilterBar'
import { SearchInput } from '@/components/analytics/SearchInput'
import { FilterChips } from '@/components/analytics/FilterChips'
import { useMemo, useState } from 'react'
import type { FilterState, ActiveFilter } from '@/types/analytics'
import {
  MOCK_CHART_DATA,
  getSchoolName,
  getRespondentGroupName,
  getSurveyTypeName,
  getQuestionTypeName,
} from '@/lib/mockAnalyticsData'

export default function Analytics() {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    school: null,
    respondentGroup: null,
    compareBy: null,
    questionType: null,
    surveyType: null,
    dateFrom: null,
    dateTo: null,
    searchQuery: '',
  })

  // Handle filter changes
  const handleFilterChange = (
    key: keyof FilterState,
    value: string | null,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Handle search change
  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }))
  }

  // Remove a filter
  const handleRemoveFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === 'searchQuery' ? '' : null,
    }))
  }

  // Get active filters for chips
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const active: ActiveFilter[] = []

    if (filters.school) {
      active.push({
        key: 'school',
        label: 'School',
        value: getSchoolName(filters.school),
      })
    }
    if (filters.respondentGroup) {
      active.push({
        key: 'respondentGroup',
        label: 'Respondent Group',
        value: getRespondentGroupName(filters.respondentGroup),
      })
    }
    if (filters.questionType) {
      active.push({
        key: 'questionType',
        label: 'Question Type',
        value: getQuestionTypeName(filters.questionType),
      })
    }
    if (filters.surveyType) {
      active.push({
        key: 'surveyType',
        label: 'Survey Type',
        value: getSurveyTypeName(filters.surveyType),
      })
    }
    if (filters.dateFrom && filters.dateTo) {
      active.push({
        key: 'dateFrom',
        label: 'Date Range',
        value: `${filters.dateFrom} to ${filters.dateTo}`,
      })
    }

    return active
  }, [filters])

  // Filter chart data based on active filters
  const filteredCharts = useMemo(() => {
    return MOCK_CHART_DATA.filter((chart) => {
      // School filter
      if (filters.school && chart.school !== filters.school) {
        return false
      }

      // Respondent group filter
      if (
        filters.respondentGroup &&
        chart.respondentGroup !== filters.respondentGroup
      ) {
        return false
      }

      // Question type filter
      if (
        filters.questionType &&
        chart.questionType !== filters.questionType
      ) {
        return false
      }

      // Survey type filter
      if (filters.surveyType && chart.surveyType !== filters.surveyType) {
        return false
      }

      // Date range filter
      if (filters.dateFrom && chart.date < filters.dateFrom) {
        return false
      }
      if (filters.dateTo && chart.date > filters.dateTo) {
        return false
      }

      // Search query filter
      if (
        filters.searchQuery &&
        !chart.question
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="min-h-screen bg-card">
      <div className="p-6 space-y-5">
        <div>
          <h1 className="font-heading text-3xl font-bold text-heading">
            Survey Analytics
          </h1>
        </div>

        {/* Filter Bar */}
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {/* Search and Filter Chips */}
        <div className="flex items-start gap-4 flex-wrap">
          <SearchInput
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
          <FilterChips
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
          />
        </div>

        {/* Chart Type Selector and Generate Report */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <ChartTypeSelector />
          <GenerateReport />
        </div>

        {/* Response Charts Grid */}
        <div className="h-[500px] overflow-y-auto rounded-md border border-border bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {filteredCharts.length > 0 ? (
              filteredCharts.map((chart) => (
                <ResponseChart
                  key={chart.id}
                  question={chart.question}
                  data="Chart data goes here"
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-muted-foreground font-body">
                No charts match the current filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
