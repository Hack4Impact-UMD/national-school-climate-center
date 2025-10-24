export interface Question {
  id: string;
  name: string;
  prompt: string;
  questionType: "multiple-choice" | "open-ended";
  inputType: "single" | "multiple" | "text";
  options: string[];
}