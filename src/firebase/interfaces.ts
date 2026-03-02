import type { Timestamp } from 'firebase-admin/firestore'
import type { FieldValue } from 'firebase-admin/firestore'

export interface User {
  uid: string
  email: string
  name: string
  role: 'admin' | 'super_admin' | 'student' | 'school_personnel'
  school_id: string
  district_id: string
  createdAt: Timestamp | FieldValue
}

export interface Question {
  question_id: string
  order: number
  required: boolean
  overrides?: Record<string, unknown>
  text?: string
}

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

export interface Answer {
  question_id: string
  value: unknown
}

export interface Response {
  id: string
  survey_id: string
  surveyTitle: string
  uid?: string | null
  surveyType?: 'pulse' | 'challenge'
  school_id: string
  district_id: string
  answers: Answer[]
  submittedAt: Timestamp | FieldValue
  consent: boolean
}

export interface ConsentGrant {
  grantId: string
  surveyId: string
  respondentKey: string
  grantedAt: Timestamp | FieldValue
}

export interface QuestionBankItem {
  id: string
  text: string
  domain: 'leadership' | 'safety' | 'learning' | 'relationships' | 'environment'
  type: string
  options?: unknown[]
  validation?: Record<string, unknown>
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

export interface Mail {
  id: string
  to: string[]
  template: {
    name: string
    data: Record<string, unknown>
  }
  status: string
  createdAt: Timestamp | FieldValue
  sentAt?: Timestamp | FieldValue
}

export interface SurveyWithId extends Survey {
  id: string
}