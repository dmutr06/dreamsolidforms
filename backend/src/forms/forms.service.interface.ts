import { Form } from "./form.interface";


export interface IFormsService {
    getFormById(id: string): Form,
}
