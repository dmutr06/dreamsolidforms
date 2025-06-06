import { AnsweredQuestion } from "./answeredQuestion";
import { escapeHTML } from "../utils/htmlUtils";


export class AnsweredChoiceQuestion extends AnsweredQuestion {
    constructor(q, a) {
        super(q, a);

        this.options = JSON.parse(q.choices);
    }

    validateAnswer() {
        return this.question.choice === this.answer?.choiceValue;
    }

    render() {
        return `
            <div>
                <h3 class="submission-answer-title">${escapeHTML(this.question.label)}</h3>
                ${this.isRight || !this.answer ? this.renderRight() : this.renderWrong()}
            </div>
        `;
    }

    renderRight() {
        return `<div class="submission-answer">Answer: "${this.options[this.question.choice]}"</div>`;
    }

    renderWrong() {
        return `
            <div class="submission-answer">
                Your answer: "${escapeHTML(this.options[this.answer.choiceValue])}"<br />
                Right answer: "${escapeHTML(this.options[this.question.choice])}"
            </div>
        `;
    }
}
