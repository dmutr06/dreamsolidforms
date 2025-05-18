

export interface QuestionRow {
    id: string,
    form_id: string,
    label: string,
    type: string,
    required: boolean,
    order_index: number,

    choice_options?: string[],
    choice_answer?: number,

    checkbox_options?: string[],
    checkbox_answer?: number[],

    text_answer?: string,

    number_min?: number,
    number_max?: number,
    number_answer?: number
}
