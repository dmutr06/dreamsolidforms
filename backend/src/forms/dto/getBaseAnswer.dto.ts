export interface GetBaseAnswerDto {
    id: string,
    question_id: string,
    type: "choice" | "text" | "number" | "checkbox"
}
