import { Form } from "../generated/prisma";


export interface IFormsService {
    getFormById(id: string): Promise<Form | null>,
}
