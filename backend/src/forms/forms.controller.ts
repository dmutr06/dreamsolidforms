import { inject, injectable } from "inversify";
import { Response } from "express";
import { Controller } from "../lib/controller";
import { get, post, use } from "../lib/decorators";
import { TYPES } from "../inversify.types";
import { IFormsService } from "./forms.service.interface";
import { CreateFormDto } from "./dtos/createForm.dto";
import { ValidateMiddlleware } from "../common/validate.middleware";
import { AuthedRequest } from "../common/customRequest";
import { HttpError } from "../common/httpError";
import { AuthGuard } from "../common/auth.guard";

@injectable()
export class FormsController extends Controller {
    constructor(
        @inject(TYPES.FormsService) private formsService: IFormsService
    ) {
        super();
    }

    @post("/")
    @use(new AuthGuard())
    @use(new ValidateMiddlleware(CreateFormDto))
    async createForm(req: AuthedRequest<CreateFormDto>, res: Response) {
        const form = await this.formsService.createForm({
            ...req.body,
            userId: req.user,
        });

        res.status(201).json({ message: "Form created", form });
    }

    @get("/:id")
    @use(new AuthGuard())
    async getFormById(req: AuthedRequest, res: Response) {
    const { id } = req.params as { id: string };

    const form = await this.formsService.getFormById(id);
    res.json(form);
}

    @get("/")
    @use(new AuthGuard())
    async getUserForms(req: AuthedRequest, res: Response) {
        const forms = await this.formsService.getFormById(req.user);
        res.json(forms);
    }
}
