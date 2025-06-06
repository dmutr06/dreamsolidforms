import { AnsweredQuestion } from "./answeredQuestion";
import { escapeHTML } from "../utils/htmlUtils";


export class AnsweredTextQuestion extends AnsweredQuestion {
    validateAnswer() {
        return this.question.text === this.answer?.textValue;
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
        return `<div class="submission-answer">Answer: "${this.question.text}"</div>`;
    }

    renderWrong() {
        return `
            <div class="submission-answer">
                Your answer: "${escapeHTML(this.answer.textValue)}"<br />
                Right answer: "${escapeHTML(this.question.text)}"
            </div>
        `;
    }
}
