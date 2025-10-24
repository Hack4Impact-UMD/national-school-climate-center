import { Timestamp, FieldValue } from 'firebase/firestore'

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
  overrides?: any
  text?: string
}

export interface Survey {
  id: string
  title: string
  description: string
  type: 'pulse' | 'challenge' | 'custom'
  status: string
  visibility: string
  school_id: string
  district_id: string
  questions: Question[]
  createdBy: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

export interface Answer {
  question_id: string
  value: any
}

export interface Response {
  id: string
  survey_id: string
  surveyTitle: string
  uid: string
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
  options?: any[]
  validation?: any
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

export interface Mail {
  id: string
  to: string[]
  template: {
    name: string
    data: any
  }
  status: string
  createdAt: Timestamp | FieldValue
  sentAt?: Timestamp | FieldValue
}
