import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Survey, QuestionBankItem } from '@/firebase/interfaces'
import type { EditableQuestion } from '@/types/surveybuilder'

/**
 * Loads a survey and combines it with questionBank data into EditableQuestion objects
 * @param surveyId - The ID of the survey to load
 * @returns Array of EditableQuestion objects ready for editing
 */
export async function loadSurveyQuestions(
  surveyId: string
): Promise<EditableQuestion[]> {
  try {
    // Step 1: Fetch the survey document
    const surveyRef = doc(db, 'surveys', surveyId)
    const surveySnapshot = await getDoc(surveyRef)

    if (!surveySnapshot.exists()) {
      throw new Error('Survey not found')
    }

    const survey = {
      id: surveySnapshot.id,
      ...surveySnapshot.data(),
    } as Survey

    // Step 2: Extract question IDs from the survey
    const questionIds = survey.questions.map((q) => q.question_id)

    if (questionIds.length === 0) {
      return []
    }

    // Step 3: Fetch all questions from questionBank by document ID
    const questionPromises = questionIds.map(async (id) => {
      const questionRef = doc(db, 'questionBank', id)
      const snapshot = await getDoc(questionRef)

      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as QuestionBankItem
      }
      return null
    })

    const results = await Promise.all(questionPromises)
    const allQuestionBankItems = results.filter(
      (q): q is QuestionBankItem => q !== null
    )

    // Step 4: Create a map for quick lookup
    const questionBankMap = new Map<string, QuestionBankItem>()
    allQuestionBankItems.forEach((q) => {
      questionBankMap.set(q.id, q)
    })

    // Step 5: Combine questionBank data with survey metadata
    const editableQuestions: EditableQuestion[] = survey.questions
      .map((surveyQuestion) => {
        const bankItem = questionBankMap.get(surveyQuestion.question_id)

        if (!bankItem) {
          console.warn(
            `Question ${surveyQuestion.question_id} not found in questionBank`
          )
          return null
        }

        // Combine QuestionBankItem with survey-specific metadata
        const editableQuestion: EditableQuestion = {
          ...bankItem,
          order: surveyQuestion.order,
          required: surveyQuestion.required,
          overrides: surveyQuestion.overrides,
          textOverride: surveyQuestion.text,
        }

        return editableQuestion
      })
      .filter((q): q is EditableQuestion => q !== null)

    // Step 6: Sort by order
    editableQuestions.sort((a, b) => a.order - b.order)

    return editableQuestions
  } catch (error) {
    console.error('Error loading survey questions:', error)
    throw error
  }
}
