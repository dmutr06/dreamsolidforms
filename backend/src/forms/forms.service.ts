import { injectable } from "inversify";
import { IFormsService } from "./forms.service.interface";
import { Form } from "../generated/prisma";

@injectable()
export class FormsService implements IFormsService {
    public async getFormById(id: string): Promise<Form | null>  {
        return null;
    }
}
