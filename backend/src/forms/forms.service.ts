import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.types";
import { FormsRepository } from "./forms.repository";
import { HttpError } from "../common/httpError";
import { CreateFormDto } from "./dtos/createForm.dto";
import { CreateSubmissionDto } from "./dtos/createSubmission.dto";
import { IFormsService } from "./forms.service.interface";
import { Form, Submission, QuestionType, Question } from "../generated/prisma";

type FormWithQuestions = Form & { questions: Question[] };

@injectable()
export class FormsService implements IFormsService {
    constructor(@inject(TYPES.FormsRepository) private formsRepo: FormsRepository) {}

    public async getAllForms(): Promise<Form[]> {
        return this.formsRepo.getAllForms();
    }

    public async getFormById(id: string): Promise<FormWithQuestions> {
        const form = await this.formsRepo.getFormById(id);
        if (!form) throw new HttpError(404, "Form not found");
        return form;
    }

    public async createForm(data: CreateFormDto & { userId: string }): Promise<Form> {
        const form = await this.formsRepo.createForm(data);
        if (!form) throw new HttpError(500, "Failed to create form");
        return form;
    }

    public async submitForm(data: CreateSubmissionDto & { userId: string }): Promise<Submission> {
        const form = await this.getFormById(data.formId);

        this.checkSubmission(data, form);

        const submission = await this.formsRepo.createSubmission(data);
        if (!submission) throw new HttpError(500, "Internal Server Error");
        return submission;
    }

    public async getSubmissionById(id: string): Promise<Submission> {
        const submission = await this.formsRepo.getSubmission(id);
        if (!submission) throw new HttpError(404, "Submission not found");
        return submission;
    }

    private checkSubmission(data: CreateSubmissionDto, form: FormWithQuestions): void {
        const questions = form.questions;

        const requiredQuestionIds = questions.filter((q) => q.required).map((q) => q.id);
        const answeredQuestionIds = data.answers.map((a) => a.questionId);

        for (const requiredId of requiredQuestionIds) {
            if (!answeredQuestionIds.includes(requiredId)) {
                throw new HttpError(400, `Required question ${requiredId} not answered`);
            }
        }

        const questionMap = new Map(questions.map((q) => [q.id, q]));

        for (const answer of data.answers) {
            const question = questionMap.get(answer.questionId);
            if (!question) {
                throw new HttpError(400, `Question ${answer.questionId} does not belong to form`);
            }

            if (answer.type !== question.type) {
                throw new HttpError(
                    400,
                    `Incorrect answer type for question ${question.id}. Expected ${question.type}, got ${answer.type}`
                );
            }

            const value = (answer.info as any).value;

            switch (question.type) {
                case QuestionType.NUMBER:
                    if (typeof value !== "number" || isNaN(value)) {
                        throw new HttpError(400, `Answer to question ${question.id} must be a valid number`);
                    }
                    break;
                case QuestionType.TEXT:
                    if (typeof value !== "string" || value.trim() === "") {
                        throw new HttpError(400, `Answer to question ${question.id} must be non-empty text`);
                    }
                    break;
                case QuestionType.CHOICE:
                    if (typeof value !== "number" || isNaN(value)) {
                        throw new HttpError(400, `Answer to question ${question.id} must be a valid choice id`);
                    }
                    break;
                default:
                    throw new HttpError(400, `Unknown question type: ${question.type}`);
            }
        }
    }
}
