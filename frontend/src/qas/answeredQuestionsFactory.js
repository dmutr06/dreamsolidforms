import { AnsweredChoiceQuestion } from "./answeredChoiceQuestion";
import { AnsweredNumberQuestion } from "./answeredNumberQuestion";
import { AnsweredQuestion } from "./answeredQuestion";
import { AnsweredTextQuestion } from "./answeredTextQuestion";


export class AnsweredQuestionFactory {
    static create(q, a) {
        switch (q.type.toLowerCase()) {
            case "text": return new AnsweredTextQuestion(q, a);
            case "number": return new AnsweredNumberQuestion(q, a);
            case "choice": return new AnsweredChoiceQuestion(q, a);
            default: return new AnsweredQuestion(q, a);
        }
    }
}
