import { collection, doc, addDoc, setDoc, deleteDoc, updateDoc, getDoc, serverTimestamp, type DocumentReference } from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Survey } from '@/types/survey'
import type { Question } from '@/firebase/interfaces'
import type { Question as BuilderQuestion } from '@/types/surveybuilder'

export async function createSurvey(survey: Survey): Promise<DocumentReference> {
  const surveysRef = collection(db, 'surveys')
  const docRef = await addDoc(surveysRef, {
    ...survey,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef
}

export async function updateSurvey(surveyId: string, updates: Partial<Survey>): Promise<void> {
  const surveyRef = doc(db, 'surveys', surveyId)
  await updateDoc(surveyRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// tbd
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function reviewSurvey(_survey: Survey) {

}

export async function saveSurvey(docRef: DocumentReference, survey: Survey) {
  await setDoc(docRef, {
    ...survey,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}


// need to check for subcollections?
export async function deleteSurvey(docRef: DocumentReference) {
  await deleteDoc(docRef);
}

export async function editSurvey(docRef: DocumentReference, survey: Survey) {
  await updateDoc(docRef, {
    ...survey,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Publish a survey built in the survey builder to Firestore
 * @param questions - Questions from the survey builder
 * @param title - Survey title
 * @param type - Survey type ('Challenge' or 'Pulse')
 * @param userId - UID of the user publishing the survey
 */
export async function publishSurvey(
  questions: BuilderQuestion[],
  title: string,
  type: 'Challenge' | 'Pulse',
  userId: string | null
): Promise<DocumentReference> {
  const questionDocs = questions.map((q, index) => ({
    question_id: q.id,
    order: index,
    text: q.prompt || q.name,
    questionType: q.questionType,
    options: q.options ?? [],
    required: false,
  }))

  const docRef = await addDoc(collection(db, 'surveys'), {
    title,
    type,
    questions: questionDocs,
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'Published',
    description: '',
    questionCount: questions.length,
    responseCount: 0,
    visibility: 'School',
    tags: [],
    school_id: '',
    district_id: '',
  })

  return docRef
}

/**
 * Edit a question's metadata within a survey
 * @param surveyId - The ID of the survey containing the question
 * @param order - The order/position of the question to edit (0-indexed)
 * @param updates - Partial updates to apply (question_id, required, text, overrides)
 * @throws Error if survey not found, no questions exist, or order is invalid
 */
export async function editQuestion(
  surveyId: string,
  order: number,
  updates: Partial<Omit<Question, 'order'>>
): Promise<void> {
  // Get survey reference and fetch current data
  const surveyRef = doc(db, 'surveys', surveyId)
  const surveySnapshot = await getDoc(surveyRef)

  // Validate survey exists
  if (!surveySnapshot.exists()) {
    throw new Error(`Survey with ID ${surveyId} not found`)
  }

  const survey = surveySnapshot.data() as Survey

  // Validate questions array exists and is not empty
  if (!survey.questions || survey.questions.length === 0) {
    throw new Error(`Survey ${surveyId} has no questions`)
  }

  // Find the question by order
  const questionIndex = survey.questions.findIndex(q => q.order === order)
  if (questionIndex === -1) {
    throw new Error(`Question with order ${order} not found in survey ${surveyId}`)
  }

  // Create updated questions array with merged updates
  const updatedQuestions = [...survey.questions]
  updatedQuestions[questionIndex] = {
    ...updatedQuestions[questionIndex],
    ...updates,
  }

  // Update the survey document
  await updateDoc(surveyRef, {
    questions: updatedQuestions,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete a question from a survey and renumber remaining questions sequentially
 * @param surveyId - The ID of the survey containing the question
 * @param order - The order/position of the question to delete (0-indexed)
 * @throws Error if survey not found, no questions exist, or order is invalid
 */
export async function deleteQuestion(
  surveyId: string,
  order: number
): Promise<void> {
  // Get survey reference and fetch current data
  const surveyRef = doc(db, 'surveys', surveyId)
  const surveySnapshot = await getDoc(surveyRef)

  // Validate survey exists
  if (!surveySnapshot.exists()) {
    throw new Error(`Survey with ID ${surveyId} not found`)
  }

  const survey = surveySnapshot.data() as Survey

  // Validate questions array exists and is not empty
  if (!survey.questions || survey.questions.length === 0) {
    throw new Error(`Survey ${surveyId} has no questions`)
  }

  // Find the question by order
  const questionIndex = survey.questions.findIndex(q => q.order === order)
  if (questionIndex === -1) {
    throw new Error(`Question with order ${order} not found in survey ${surveyId}`)
  }

  // Remove the question and renumber remaining questions sequentially (0, 1, 2, 3...)
  const updatedQuestions = survey.questions
    .filter(q => q.order !== order)
    .map((q, index) => ({ ...q, order: index }))

  // Prepare update object
  const updateData: {
    questions: Question[]
    updatedAt: ReturnType<typeof serverTimestamp>
    questionCount?: number
  } = {
    questions: updatedQuestions,
    updatedAt: serverTimestamp(),
  }

  // Update questionCount if it exists
  if (typeof survey.questionCount === 'number') {
    updateData.questionCount = Math.max(0, survey.questionCount - 1)
  }

  // Update the survey document
  await updateDoc(surveyRef, updateData)
}