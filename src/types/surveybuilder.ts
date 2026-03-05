import type { QuestionBankItem } from '@/firebase/interfaces'

export type Question = {
  id: string;
  name: string;
  prompt: string;
  questionType: "multiple-choice" | "open-ended";
  inputType: "single" | "multi" | "text";
  options: string[];
};

/**
 * EditableQuestion combines QuestionBankItem data with survey-specific metadata
 * Used when loading and editing questions in the survey builder
 */
export interface EditableQuestion extends QuestionBankItem {
  order: number          // Position in the survey
  required: boolean      // Whether the question is required
  overrides?: unknown    // Any custom settings for this survey
  textOverride?: string  // Optional text override (different from questionBank.text)
}