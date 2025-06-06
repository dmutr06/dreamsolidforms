import { AnsweredQuestion } from "./answeredQuestion";
import { escapeHTML } from "../utils/htmlUtils";


export class AnsweredNumberQuestion extends AnsweredQuestion {
    validateAnswer() {
        return this.question.number === this.answer?.numberValue;
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
        return `<div class="submission-answer">Answer: "${this.question.number}"</div>`;
    }

    renderWrong() {
        return `
            <div class="submission-answer">
                Your answer: "${this.answer.numberValue}"<br />
                Right answer: "${this.question.number}"
            </div>
        `;
    }
}
