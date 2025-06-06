import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.types";
import { FormsRepository } from "./forms.repository";
import { HttpError } from "../common/httpError";
import { CreateFormDto } from "./dtos/createForm.dto";
import { CreateSubmissionDto } from "./dtos/createSubmission.dto";
import { IFormsService } from "./forms.service.interface";
import { Form, Submission, Question } from "../generated/prisma";

@injectable()
export class FormsService implements IFormsService {
    constructor(@inject(TYPES.FormsRepository) private formsRepo: FormsRepository) {}

    public async getAllForms(): Promise<Form[]> {
        return this.formsRepo.getAllForms();
    }

    public async getFormById(id: string): Promise<Form> {
        const form = await this.formsRepo.getFormByIdWithoutAnswers(id);
        if (!form) throw new HttpError(404, "Form not found");
        return form;
    }

    public async createForm(data: CreateFormDto & { userId: string }): Promise<Form> {
        const form = await this.formsRepo.createForm(data);
        if (!form) throw new HttpError(500, "Failed to create form");
        return form;
    }

    public async submitForm(data: CreateSubmissionDto & { userId: string }): Promise<Submission> {
        const form = await this.getFormById(data.formId) as (Form & { questions: Question[] });

        form.questions.forEach(q => {
            const ans = data.answers.find(a => a.questionId == q.id);

            if (!ans) {
                if (q.required)
                    throw new HttpError(400, `Question ${q.order + 1} is required`);
                return;
            }

            if (ans.type.toLowerCase() != q.type.toLowerCase())
                throw new HttpError(400, `Question ${q.order + 1} has to be of type "${q.type}"`);
        });

        const submission = await this.formsRepo.createSubmission(data);
        if (!submission) throw new HttpError(500, "Internal Server Error");
        return submission;
    }

    public async getSubmissionById(id: string, userId: string): Promise<Submission> {
        const submission = await this.formsRepo.getSubmission(id);
        if (!submission) throw new HttpError(404, "Submission not found");

        if (submission.userId == userId) return submission;

        const form = await this.getFormById(submission.formId);
        if (form.userId == userId) return submission;

        throw new HttpError(403, "Can not access this submission");
    }

    public async getUsersSubmissions(userId: string): Promise<Submission[]> {
        return this.formsRepo.getUsersSubmission(userId);
    }
}
