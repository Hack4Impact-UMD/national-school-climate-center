import type { Survey } from "@/types/survey";
import { serverTimestamp } from "firebase/firestore";

export function createSurvey(_survey :Survey) {
    
}

export function updateSurvey(_survey :Survey) {

}

export function reviewSurvey(_survey :Survey) {

}

export async function saveSurvey(docRef: DocumentReference, survey :Survey) { 
    await setDoc(docRef, {
        ...survey,
        updatedAt: serverTimestamp(),
    }, {merge: true});
}

export function deleteSurvey(_survey :Survey) {

}

export function editSurvey(_survey :Survey) {

}