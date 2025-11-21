import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import type { Answer, Response } from '@/firebase/interfaces'

export type SurveyKind = 'pulse' | 'challenge'

export type SubmitSurveyResponseParams = {
  surveyId: string
  surveyTitle?: string
  surveyType: SurveyKind
  answers: Answer[]
  consent: boolean
  schoolId?: string
  districtId?: string
  respondentGroup?: string
}

/**
 * Submits a survey response to Firestore.
 * - Pulse: includes `uid` and a minimal `respondent` profile
 * - Challenge: omits PII (no `uid` field)
 */
export async function submitSurveyResponse(params: SubmitSurveyResponseParams) {
  const {
    surveyId,
    surveyTitle,
    surveyType,
    answers,
    consent,
    schoolId = '',
    districtId = '',
    respondentGroup = 'students',
  } = params

  if (!consent) {
    throw new Error('Consent must be true to submit a response.')
  }

  // Build a Firestore document matching our Response schema (minus the id),
  // with an extra optional field `respondent_group` used by analytics.
  const base: Omit<Response, 'id'> & { respondent_group?: string } = {
    survey_id: surveyId,
    surveyTitle: surveyTitle ?? '',
    surveyType,
    answers,
    consent: true,
    submittedAt: serverTimestamp(),
    school_id: schoolId,
    district_id: districtId,
    uid: null,
  }
  if (respondentGroup) base.respondent_group = respondentGroup

  const currentUser = auth.currentUser

  if (surveyType === 'pulse') {
    if (!currentUser) {
      throw new Error('Must be signed in to submit a pulse survey.')
    }
    base.uid = currentUser.uid
  }

  // For challenge: we deliberately do not include `uid` or any PII

  const colRef = collection(db, 'responses')
  const docRef = await addDoc(colRef, base)
  return docRef.id
}


