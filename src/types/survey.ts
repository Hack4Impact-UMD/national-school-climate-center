import type { Timestamp } from "firebase-admin/firestore"

export type Survey = {
  title: string
  description: string
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  status: 'Draft' | 'Published' | 'Closed'
  visibility: 'School' | 'District' | 'Public'
  questionCount: number
  responseCount: number
  schoolId: string
  districtId: string
  tags: string[]
  type: 'Pulse' | 'Challenge' | 'Custom'
}

export type PulseSurvey = Survey & {
    school: string;
    schoolDistrict: string;
}

export type ChallenegeSurvey = Survey & {

}