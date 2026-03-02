import { collection, addDoc, serverTimestamp, type DocumentReference } from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Survey } from '@/types/survey'

export async function createSurvey(survey: Survey): Promise<DocumentReference> {
  const surveysRef = collection(db, 'surveys')
  const docRef = await addDoc(surveysRef, {
    ...survey,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef
}

export function updateSurvey(_survey :Survey) {

}

export function reviewSurvey(_survey :Survey) {

}

export function saveSurvey(_survey :Survey) { 
    
}

export function deleteSurvey(_survey :Survey) {

}

export function editSurvey(_survey :Survey) {

}