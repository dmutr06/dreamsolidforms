import { Question } from "./question";


export class TextQuestion extends Question {
    public answer: string;

    constructor(label: string, required: boolean, answer: string) {
        super(label, required);
        this.answer = answer;
    }

    public validate(answer: unknown): boolean {
        return this.answer === answer;
    }
}
