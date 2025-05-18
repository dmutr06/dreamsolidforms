import { inject, injectable } from "inversify";
import { GetFormInfoDto } from "./dto/getFormInfo.dto";
import { TYPES } from "../inversify.types";
import { Database } from "../database/database.interface";
import { HttpError } from "../common/httpError";
import { GetFormDto } from "./dto/getForm.dto";
import { CreateFormDto } from "./dto/createForm.dto";
import { createId } from "@paralleldrive/cuid2";
import { CreateChoiceQuestion, CreateNumberQuestion, CreateTextQuestion } from "./dto/createQuestion.dto";
import { QuestionRow } from "./questions/questionRow.interface";

@injectable()
export class FormsRepository {
    constructor(@inject(TYPES.Database) private db: Database) {}
    
    public async getAllForms(): Promise<GetFormInfoDto[]> {
        const res = await this.db.query<GetFormInfoDto>("SELECT id, title, description, created_at FROM forms", []);

        if (!res) throw new HttpError(500, "Internal server error :(");

        return res;
    }

    public async getFormById(id: string): Promise<GetFormDto> {
        const formsRow = await this.db.query<GetFormDto>("SELECT * FROM forms where id = ?", [id]);

        if (formsRow.length < 1)
            throw new HttpError(404, "Form not found");

        const form = formsRow[0];

        const questions = await this.db.query<QuestionRow>(
            `
                SELECT
                    q.id,
                    q.label,
                    q.type,
                    q.required,
                    q.order_index,
                    c.options AS choice_options,
                    c.answer AS choice_answer,
                    cb.options AS checkbox_options,
                    cb.answer AS checkbox_answer,
                    t.answer AS text_answer,
                    n.min AS number_min,
                    n.max AS number_max,
                    n.answer AS number_answer
                FROM questions q
                LEFT JOIN choice_questions c ON c.question_id = q.id
                LEFT JOIN checkbox_questions cb ON cb.question_id = q.id
                LEFT JOIN text_questions t ON t.question_id = q.id
                LEFT JOIN number_questions n ON n.question_id = q.id
                WHERE q.form_id = ?
                ORDER BY q.order_index ASC
            `,
            [id]
        ).then(res => {
            return res.map(q => {
                Object.keys(q).forEach((key) => {
                    if (q[(key as keyof QuestionRow)] === null)
                        delete q[(key as keyof QuestionRow)];
                });

                q.choice_options = q.choice_options ? JSON.parse(String(q.choice_options)) : undefined;
                q.checkbox_options = q.checkbox_options ? JSON.parse(String(q.checkbox_options)) : undefined;
                q.checkbox_answer = q.checkbox_answer ? JSON.parse(String(q.checkbox_answer)) : undefined;
                q.choice_options = q.choice_options ? JSON.parse(String(q.choice_options)) : undefined;

                return q;
            })
        });

        return { ...form, questions };
    }

    public async createForm(form: CreateFormDto & { userId: string }): Promise<boolean> {
        const formId = createId();
        if (!(await this.db.run(
            "INSERT INTO forms (id, user_id, title, description) VALUES (?, ?, ?, ?)",
            [formId, form.userId, form.title, form.description]
        ))) throw new HttpError(400, "Bad request");
        
        for (const q of form.questions) {
            const questionId = createId();
            await this.db.run(
                "INSERT INTO questions (id, form_id, label, type, required, order_index) VALUES (?, ?, ?, ?, ?, ?)",
                [questionId, formId, q.label, q.type, Number(q.required), q.order || null]
            );

            console.log(q);

            switch (q.type) {
                case "choice": {
                    const info = q.info as CreateChoiceQuestion;
                    await this.db.run(
                        "INSERT INTO choice_questions (id, question_id, options, answer) VALUES (?, ?, ?, ?)",
                        [createId(), questionId, JSON.stringify(info.options), info.answer]
                    );
                    break;
                }
                case "text": {
                    const info = q.info as CreateTextQuestion;
                    const id = createId();
                    await this.db.run(
                        "INSERT INTO text_questions (id, question_id, answer) VALUES (?, ?, ?)",
                        [id, questionId, info.answer]
                    );
                    break;
                }
                case "number": {
                    const info = q.info as CreateNumberQuestion;
                    await this.db.run(
                        "INSERT INTO number_questions (id, question_id, answer) VALUES (?, ?, ?)",
                        [createId(), questionId, info.answer]
                    );
                    break;
                }
            }
        }

        return true;
    }
}
