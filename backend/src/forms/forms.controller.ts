import { inject, injectable } from "inversify";
import { Response } from "express";
import { Controller } from "../lib/controller";
import { get, post, use } from "../lib/decorators";
import { TYPES } from "../inversify.types";
import { IFormsService } from "./forms.service.interface";
import { CreateFormDto } from "./dtos/createForm.dto";
import { ValidateMiddlleware } from "../common/validate.middleware";
import { AuthedRequest } from "../common/customRequest";
import { AuthGuard } from "../common/auth.guard";
import { CreateSubmissionDto } from "./dtos/createSubmission.dto";

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


    @get("/")
    @use(new AuthGuard())
    async getForms(_req: AuthedRequest, res: Response) {
        const forms = await this.formsService.getAllForms();
        return res.json(forms);
    }

    @post("/submissions")
    @use(new AuthGuard(), new ValidateMiddlleware(CreateSubmissionDto))
    async submitForm({ body, user }: AuthedRequest<CreateSubmissionDto>, res: Response) {
        const result = this.formsService.submitForm({ ...body, userId: user });

        return res.json(result);
    }

    @get("/submissions")
    @use(new AuthGuard())
    async getUsersSubmissions({ user }: AuthedRequest, res: Response) {
        const submissions = await this.formsService.getUsersSubmissions(user);

        return res.json(submissions);
    }

    @get("/submissions/:id")
    @use(new AuthGuard())
    async getSubmission({ user, params }: AuthedRequest, res: Response) {
        const { id } = params as { id: string };

        const submission = await this.formsService.getSubmissionById(id, user);

        return res.json(submission);
    }

    @get("/:id")
    @use(new AuthGuard())
    async getFormById(req: AuthedRequest, res: Response) {
        const { id } = req.params as { id: string };

        const form = await this.formsService.getFormById(id);
        return res.json(form);
    }
}
