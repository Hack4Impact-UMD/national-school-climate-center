import type { Timestamp } from "firebase-admin/firestore"
import type { Question } from "./surveybuilder";
import type { Response } from "./response";

export type Survey = {
  id: string
  title: string
  description: string
  createdBy: string
  createdAt: Timestamp
  status: 'Draft' | 'Published' | 'Closed'
  questionCount: number
  responseCount: number
  visibility: boolean
  school: string
  district: string
  tags: string[]
  type: string
  updatedAt: Timestamp
}

export type PulseSurvey = Survey & {
    school: string;
    schoolDistrict: string;
}

export type ChallenegeSurvey = Survey & {

}