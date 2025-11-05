export type Question = {
  id: string;
  name: string;
  prompt: string;
  questionType: "multiple-choice" | "open-ended";
  inputType: "single" | "multi" | "text";
  options: string[];
};