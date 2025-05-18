import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { Controller } from "../lib/controller";
import { get, post, use } from "../lib/decorators";
import { TYPES } from "../inversify.types";
import { IFormsService } from "./forms.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";
import { FormsRepository } from "./forms.repository";
import { ValidateMiddlleware } from "../common/validate.middleware";
import { CreateFormDto } from "./dto/createForm.dto";
import { TypedRequest } from "../common/customRequest";
import { HttpError } from "../common/httpError";

// TODO write users service and rewrite handler

@injectable()
export class FormsController extends Controller {
    constructor(@inject(TYPES.FormsService) private formsService: IFormsService, @inject(TYPES.FormsRepository) private formsRepo: FormsRepository) {
        super();
    }
    
    @post("/")
    @use(new ValidateMiddlleware(CreateFormDto))
    async createForm(req: TypedRequest<CreateFormDto>, res: Response) {
        const userId = "ud7m5jkcptz88fj46s88vov5";

        const result = await this.formsRepo.createForm({ ...req.body, userId });

        if (!result)
            throw new HttpError(400, "Bad request");

        res.json({ statusCode: 201, message: "Created" });
    }

    @get("/:id")
    // @use(new AuthMiddleware())
    async getForm(req: Request, res: Response) {
        return res.json(await this.formsRepo.getFormById(req.params.id));
    }

    @get("/")
    async getAllForms(req: Request, res: Response) {
        return res.json(await this.formsRepo.getAllForms());
    }
}
