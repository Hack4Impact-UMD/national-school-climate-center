import { Timestamp } from "firebase/firestore";

//enums
export type SurveyStatus =
  | "Draft"
  | "Published"
  | "Closed";


export type QuestionType =
  | "Multiple_Choice"
  | "Text"
  | "Rating"
  | "Checkbox"
  | "Dropdown";


export type UserRole =
  | "Admin"
  | "Creator"
  | "Respondent";


  //main survey type
export interface Survey {
  title: string;
  description: string;
  createdBy: string;        
  createdAt: Timestamp;
  status: SurveyStatus;

  questionCount: number;
  responseCount: number;

  isAnonymous: boolean;

  school: string;
  district: string;

  tags: string[];
}



export interface QuestionOption {
  id: string;
  label: string;
}

export interface RatingScale {
  min: number;
  max: number;
}

export interface Question {
  type: QuestionType;
  text: string;
  required: boolean;
  order: number;

  options?: QuestionOption[];  
  scale?: RatingScale;          
}


export type answerType =
  | string
  | number
  | boolean
  | string[]
  | null;

export interface Answer {
  question_id: string
  value: string | number | boolean
}


// all survey responses
export interface Responses {
  userId: string | null;
  submittedAt: Timestamp;
  answers: Answer[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp;
}