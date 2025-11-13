export type School = {
  id: string
  name: string
}

export type RespondentGroup = {
  id: string
  name: string
}

export type QuestionType = {
  id: string
  name: string
}

export type SurveyType = {
  id: string
  name: string
}

export type CompareBy = { //placeholder
  id: string
  name: string
}

export type ChartData = {
  id: string
  question: string
  questionType: string
  surveyType: string
  school: string
  respondentGroup: string
  responseData: {
    label: string
    value: number
  }[]
  date: string // ISO date string
}

export type FilterState = {
  school: string | null
  respondentGroup: string | null
  compareBy: string | null
  questionType: string | null
  surveyType: string | null
  dateFrom: string | null
  dateTo: string | null
  searchQuery: string
}

export type ActiveFilter = {
  key: keyof FilterState
  label: string
  value: string
}
