import { HttpError } from "../../common/httpError";
import { ChoiceQuestion } from "./choiceQuestion";
import { Question } from "./question";
import { TextQuestion } from "./textQuestion";


// export class QuestionFactory {
//     static create(row: QuestionRow): Question {
//         switch (row.type) {
//             case "choice":
//                 if (!row.choice_answer || !row.choice_options) throw new HttpError(400, "Bad payload for choice question");
//                 return new ChoiceQuestion(row.label, row.required, row.choice_answer, row.choice_options);
//             case "text":
//                 if (!row.text_answer) throw new HttpError(400, "Bad payload for text question");
//                 return new TextQuestion(row.label, row.required, row.text_answer);
//
//             default:
//                 throw new HttpError(400, `Uknown question type "${row.type}"`);
//         }
//     }
// }
