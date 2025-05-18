import { injectable } from "inversify";
import { IFormsService } from "./forms.service.interface";
import { Form } from "./form.interface";

@injectable()
export class FormsService implements IFormsService {
    public getFormById(id: string): Form {
        return { id, title: id, questions: [] };
    }
}
