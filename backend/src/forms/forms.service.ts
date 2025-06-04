import { inject, injectable } from "inversify";
import { TYPES } from "../inversify.types";
import { FormsRepository } from "./forms.repository";
import { HttpError } from "../common/httpError";
import { CreateFormDto } from "./dtos/createForm.dto";
import { CreateSubmissionDto } from "./dtos/createSubmission.dto";
import { IFormsService } from "./forms.service.interface";
import { Form, Submission } from "../generated/prisma";

@injectable()
export class FormsService implements IFormsService {
    constructor(@inject(TYPES.FormsRepository) private formsRepo: FormsRepository) {}

    public async getAllForms(): Promise<Form[]> {
        return this.formsRepo.getAllForms();
    }

    public async getFormById(id: string): Promise<Form> {
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
        const form = await this.formsRepo.getFormById(data.formId);
        if (!form) {
            throw new HttpError(404, "Form not found");
        }

        const questions = form.questions;

        const requiredQuestionIds = form.questions
        .filter((q) => q.required)
        .map((q) => q.id);

        const answeredQuestionIds = data.answers.map((a) => a.questionId);

        for (const requiredId of requiredQuestionIds) {
            if (!answeredQuestionIds.includes(requiredId)) {
                throw new HttpError(400, `Required question ${requiredId} not answered`);
            }
        }

        const submission = await this.formsRepo.createSubmission(data);
        if (!submission) throw new HttpError(500, "Internal Server Error");
        return submission;
    }

    public async getSubmissionById(id: string): Promise<Submission> {
        const submission = await this.formsRepo.getSubmission(id);
        if (!submission) throw new HttpError(404, "Submission not found");
        return submission;
    }
}
