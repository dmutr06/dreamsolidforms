import { Question } from "./question";


export class ChoiceQuestion extends Question {
    public answer: number;
    public options: string[];

    constructor(label: string, required: boolean, answer: number, options: string[]) {
        super(label, required);
        this.answer = answer;
        this.options = options;
    }

    public validate(answer: unknown): boolean {
        return this.answer === answer; 
    }
}
