import { Question } from "./questions/question";

export interface Form {
    id: string,
    title: string,
    questions: Question[],
}
