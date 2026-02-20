import type { Timestamp } from "firebase-admin/firestore"
import type { Question } from "./surveybuilder";
import type { Response } from "./response";

export type Survey = {
    creationDate: Timestamp;
    createdBy: number;
    questions: Question[];
    responses: Response[];


}

export type PulseSurvey = Survey & {
    school: string;
    schoolDistrict: string;
}

export type ChallenegeSurvey = Survey & {

}