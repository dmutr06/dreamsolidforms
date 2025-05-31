import { Answer } from "../submissions/answer.interface";

export interface GetSubmissionDto {
    id: string,
    formId: string,
    answers: Answer[],
}
