import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.types";
import { HttpError } from "../common/httpError";
import { CreateFormDto } from "./dtos/createForm.dto";
import { CreateChoiceQuestion, CreateNumberQuestion, CreateTextQuestion } from "./dtos/createQuestion.dto";
import { ChoiceAnswer, NumberAnswer, TextAnswer } from "./dtos/createAnswer.dto";
import { CreateSubmissionDto } from "./dtos/createSubmission.dto";
import { Form, Question, Prisma, QuestionType, Submission } from "../generated/prisma";
import { PrismaService } from "../database/prisma.service";

@injectable()
export class FormsRepository {
    private readonly form: Prisma.FormDelegate;
    private readonly submission: Prisma.SubmissionDelegate;

    constructor(@inject(TYPES.PrismaService) private db: PrismaService) {
        this.form = this.db.client.form;
        this.submission = this.db.client.submission;
    }

    public async getAllForms(): Promise<Form[]> {
        return this.form.findMany();
    }

    public async getFormById(id: string): Promise<Form | null> {
        return this.form.findUnique({
            where: { id },
            include: { questions: true },
        });
    }

    public async getFormByIdWithoutAnswers(id: string): Promise<Form | null> {
        return this.form.findUnique({
            where: { id },
            include: { questions: { omit: { text: true, choice: true, number: true, checkbox: true } } },
        });
    }

    public async createForm(form: CreateFormDto & { userId: string }): Promise<Form | null> {
        return this.form.create({
            data: {
                title: form.title,
                description: form.description,
                userId: form.userId,
                questions: {
                    create: form.questions.map((q, idx) => {
                        const base = {
                            label: q.label,
                            required: q.required ?? false,
                            order: idx,
                            type: this.mapType(q.type),
                        };

                        switch (base.type) {
                            case QuestionType.TEXT:
                                return {
                                    ...base,
                                    text: (q.info as CreateTextQuestion).answer,
                                };
                            case QuestionType.NUMBER:
                                return {
                                    ...base,
                                    number: (q.info as CreateNumberQuestion).answer,
                                };
                            case QuestionType.CHOICE:
                                return {
                                    ...base,
                                    choices: JSON.stringify((q.info as CreateChoiceQuestion).options),
                                    choice: (q.info as CreateChoiceQuestion).answer,
                                };
                            case QuestionType.CHECKBOX:
                                throw new HttpError(501, "Checkbox question type not implemented yet");
                            default:
                                throw new HttpError(400, `Invalid question type: ${q.type}`);
                        }
                    }),
                },
            },
        });
    }

    private mapType(type: string): QuestionType {
        switch (type.toLowerCase()) {
            case "text":
                return QuestionType.TEXT;
            case "number":
                return QuestionType.NUMBER;
            case "choice":
                return QuestionType.CHOICE;
            case "checkbox":
                return QuestionType.CHECKBOX;
            default:
                throw new HttpError(400, `Invalid question type: ${type}`);
        }
    }

    public async createSubmission(submission: CreateSubmissionDto & { userId: string }): Promise<Submission | null> {
        return this.submission.create({
            data: {
                form: { connect: { id: submission.formId } },
                user: { connect: { id: submission.userId } },
                answers: {
                    create: submission.answers.map((a) => {
                        const base = {
                            question: { connect: { id: a.questionId } },
                        };

                        const type = this.mapType(a.type);

                        switch (type) {
                            case QuestionType.TEXT:
                                return { ...base, textValue: (a.info as TextAnswer).value };
                            case QuestionType.NUMBER:
                                return { ...base, numberValue: (a.info as NumberAnswer).value };
                            case QuestionType.CHOICE:
                                return { ...base, choiceValue: (a.info as ChoiceAnswer).value };
                            case QuestionType.CHECKBOX:
                                throw new HttpError(501, "Checkbox answer type not implemented yet");
                            default:
                                throw new HttpError(400, `Unknown answer type: ${a.type}`);
                        }
                    }),
                },
            },
            include: { answers: true },
        });
    }

    public async getSubmission(id: string): Promise<Submission | null> {
        return this.submission.findUnique({ where: { id }, include: { answers: true, form: { include: { questions: true } } } });
    }

    public async getUsersSubmission(userId: string): Promise<Submission[]> {
        return this.submission.findMany({ where: { userId }, include: { form: { select: { title: true } } } });
    }
}
