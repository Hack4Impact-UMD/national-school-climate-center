import type { FieldValue, Timestamp } from "firebase-admin/firestore"
import type { Question } from "./surveybuilder"

export interface Survey {
  title: string
  description: string
  createdBy: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
  status: 'Draft' | 'Published' | 'Closed'
  visibility: 'School' | 'District' | 'Public'
  questionCount: number
  responseCount: number
  school_id: string
  district_id: string
  tags: string[]
  type: 'Pulse' | 'Challenge' | 'Custom'
  questions?: Question[] // optional for listing surveys without loading all questions, but should be included when fetching a single survey for editing or responding
}

export type PulseSurvey = Survey & {
  school: string;
  schoolDistrict: string;
}

export type ChallenegeSurvey = Survey & {

}