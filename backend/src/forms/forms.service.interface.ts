import { Form, Submission } from "../generated/prisma";
import { CreateFormDto } from "./dtos/createForm.dto";
import { CreateSubmissionDto } from "./dtos/createSubmission.dto";

export interface IFormsService {
    getAllForms(): Promise<Form[]>;
    getFormById(id: string): Promise<Form>;
    createForm(data: CreateFormDto & { userId: string }): Promise<Form>;
    submitForm(data: CreateSubmissionDto & { userId: string }): Promise<Submission>;
    getSubmissionById(id: string, userId: string): Promise<Submission>;
    getUsersSubmissions(id: string): Promise<Submission[]>
}
