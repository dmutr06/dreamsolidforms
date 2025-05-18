

export abstract class Question {
    public label: string;
    public required: boolean;
    public answer: unknown;

    constructor(label: string, required: boolean) {
        this.label = label;
        this.required = required;
    }

    public abstract validate(answer: unknown): boolean;
}
