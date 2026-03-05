import type {
  School,
  RespondentGroup,
  QuestionType,
  SurveyType,
  CompareBy,
  ChartData,
} from '@/types/analytics'

export const SCHOOLS: School[] = [
  { id: 'hs', name: 'High School' },
  { id: 'ms', name: 'Middle School' },
  { id: 'es', name: 'Elementary School' },
]

export const RESPONDENT_GROUPS: RespondentGroup[] = [
  { id: 'students', name: 'Students' },
  { id: 'parents', name: 'Parents' },
  { id: 'staff', name: 'Staff' },
]

export const QUESTION_TYPES: QuestionType[] = [
  { id: 'multiple-choice', name: 'Multiple Choice' },
  { id: 'open-ended', name: 'Open-Ended' },
]

export const SURVEY_TYPES: SurveyType[] = [
  { id: 'challenge', name: 'School Climate Challenge' },
  { id: 'pulse', name: 'School Climate Pulse' },
]

export const COMPARE_BY_OPTIONS: CompareBy[] = [
  { id: 'placeholder', name: 'Placeholder' },
]

// Sample survey questions
const SAMPLE_QUESTIONS = [
  'How safe do you feel at school?',
  'Do you feel respected by your teachers?',
  'Are you comfortable reporting bullying?',
  'Do you feel like you belong at this school?',
  'Do teachers care about your well-being?',
  'Is the school environment supportive?',
  'Are conflicts resolved fairly?',
  'Do you have a trusted adult at school?',
  'Do you feel valued in your classes?',
  'Is there a positive school culture?',
  'Do you feel safe in the hallways?',
  'Are school rules applied fairly?',
]

// Generate comprehensive mock chart data
export const MOCK_CHART_DATA: ChartData[] = []

let chartId = 1

// Generate data for each school type
SCHOOLS.forEach((school) => {
  // Generate data for each respondent group
  RESPONDENT_GROUPS.forEach((group) => {
    // Generate data for each survey type
    SURVEY_TYPES.forEach((surveyType) => {
      // Pick a subset of questions for variety
      const questionCount = Math.floor(Math.random() * 4) + 3 // 3-6 questions per combination
      const selectedQuestions = SAMPLE_QUESTIONS.slice(0, questionCount)

      selectedQuestions.forEach((question) => {
        // Generate data for different dates (last 3 months)
        const datesCount = Math.floor(Math.random() * 2) + 1 // 1-2 dates
        for (let i = 0; i < datesCount; i++) {
          const daysAgo = Math.floor(Math.random() * 90) // Random day in last 90 days
          const date = new Date()
          date.setDate(date.getDate() - daysAgo)

          MOCK_CHART_DATA.push({
            id: `chart-${chartId++}`,
            question,
            questionType: 'multiple-choice',
            surveyType: surveyType.id,
            school: school.id,
            respondentGroup: group.id,
            responseData: [],
            date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          })
        }
      })
    })
  })
})

// Helper function to get display names
export const getSchoolName = (id: string): string => {
  return SCHOOLS.find((s) => s.id === id)?.name || id
}

export const getRespondentGroupName = (id: string): string => {
  return RESPONDENT_GROUPS.find((r) => r.id === id)?.name || id
}

export const getSurveyTypeName = (id: string): string => {
  return SURVEY_TYPES.find((s) => s.id === id)?.name || id
}

export const getQuestionTypeName = (id: string): string => {
  return QUESTION_TYPES.find((q) => q.id === id)?.name || id
}
