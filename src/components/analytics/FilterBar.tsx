import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import type {
  FilterState,
  School,
  RespondentGroup,
  QuestionType,
  SurveyType,
  CompareBy,
} from '@/types/analytics'
import {
  SCHOOLS as DEFAULT_SCHOOLS,
  RESPONDENT_GROUPS as DEFAULT_RESPONDENT_GROUPS,
  QUESTION_TYPES as DEFAULT_QUESTION_TYPES,
  SURVEY_TYPES as DEFAULT_SURVEY_TYPES,
  COMPARE_BY_OPTIONS as DEFAULT_COMPARE_BY_OPTIONS,
} from '@/lib/mockAnalyticsData'

type FilterBarProps = {
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string | null) => void
  options?: {
    schools?: School[]
    respondentGroups?: RespondentGroup[]
    questionTypes?: QuestionType[]
    surveyTypes?: SurveyType[]
    compareBy?: CompareBy[]
  }
}

export function FilterBar({ filters, onFilterChange, options }: FilterBarProps) {
  const {
    schools = DEFAULT_SCHOOLS,
    respondentGroups = DEFAULT_RESPONDENT_GROUPS,
    questionTypes = DEFAULT_QUESTION_TYPES,
    surveyTypes = DEFAULT_SURVEY_TYPES,
    compareBy = DEFAULT_COMPARE_BY_OPTIONS,
  } = options ?? {}

  return (
    <div className="space-y-4">
      {/* Main filter row */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* School */}
        <Select
          value={filters.school || ''}
          onValueChange={(value) => onFilterChange('school', value)}
        >
          <SelectTrigger
            className="w-[181px] font-body bg-background border-0 rounded-lg shadow-sm data-[placeholder]:text-[#444444]"
            style={{ color: '#444444' }}
          >
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Respondent Group */}
        <Select
          value={filters.respondentGroup || ''}
          onValueChange={(value) => onFilterChange('respondentGroup', value)}
        >
          <SelectTrigger
            className="w-[181px] font-body bg-background border-0 rounded-lg shadow-sm data-[placeholder]:text-[#444444]"
            style={{ color: '#444444' }}
          >
            <SelectValue placeholder="Respondent Group" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {respondentGroups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Compare By */}
        <Select
          value={filters.compareBy || ''}
          onValueChange={(value) => onFilterChange('compareBy', value)}
        >
          <SelectTrigger
            className="w-[181px] font-body bg-background border-0 rounded-lg shadow-sm data-[placeholder]:text-[#444444]"
            style={{ color: '#444444' }}
          >
            <SelectValue placeholder="Compare By" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {compareBy.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Question Type */}
        <Select
          value={filters.questionType || ''}
          onValueChange={(value) => onFilterChange('questionType', value)}
        >
          <SelectTrigger
            className="w-[181px] font-body bg-background border-0 rounded-lg shadow-sm data-[placeholder]:text-[#444444]"
            style={{ color: '#444444' }}
          >
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {questionTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Survey Type */}
        <Select
          value={filters.surveyType || ''}
          onValueChange={(value) => onFilterChange('surveyType', value)}
        >
          <SelectTrigger
            className="w-[181px] font-body bg-background border-0 rounded-lg shadow-sm data-[placeholder]:text-[#444444]"
            style={{ color: '#444444' }}
          >
            <SelectValue placeholder="Survey Type" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {surveyTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Picker */}
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border-0 bg-background shadow-sm w-[320px]">
          <Input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFilterChange('dateFrom', e.target.value || null)}
            className="flex-1 h-auto border-0 p-0 shadow-none bg-transparent font-body text-sm focus-visible:ring-0"
            style={{ color: '#444444' }}
            placeholder="From"
          />
          <span className="text-sm font-body flex-shrink-0" style={{ color: '#444444' }}>
            -
          </span>
          <Input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFilterChange('dateTo', e.target.value || null)}
            className="flex-1 h-auto border-0 p-0 shadow-none bg-transparent font-body text-sm focus-visible:ring-0"
            style={{ color: '#444444' }}
            placeholder="To"
          />
        </div>
      </div>
    </div>
  )
}
