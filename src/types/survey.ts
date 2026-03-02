import type { Timestamp } from "firebase-admin/firestore"
import type { Question } from "./surveybuilder";
import type { Response } from "./response";

export type Survey = {
    title: string;
    description: string;
    createdBy: string;
    createdAt: Timestamp;
    status: "Draft" | "Published" | "Closed";
    questionCount: number;
    responseCount: number;
    isAnonymous: boolean;
    school: string;
    district: string;
    tags: string[];
    creationDate: Timestamp;
    questions: Question[];
    responses: Response[];


}

export type PulseSurvey = Survey & {
    school: string;
    schoolDistrict: string;
}

export type ChallenegeSurvey = Survey & {

}