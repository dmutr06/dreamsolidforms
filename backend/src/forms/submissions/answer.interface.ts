export interface Answer {
    id: string,
    questionId: string,
    type: "choice" | "text" | "number" | "checkbox",
    value: unknown,
}
