import { QuestionRow } from "../questions/questionRow.interface";

export interface GetFormDto {
    id: string,
    title: string,
    user_id: string,
    description?: string,
    created_at: Date,
    questions: QuestionRow[],
}
