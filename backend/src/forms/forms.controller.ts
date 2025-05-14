import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { Controller } from "../lib/controller";
import { get, use } from "../lib/decorators";
import { TYPES } from "../inversify.types";
import { IFormsService } from "./forms.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";

@injectable()
export class FormsController extends Controller {
    constructor(@inject(TYPES.FormsService) private formsService: IFormsService) {
        super();
    }
    
    @get("/:id")
    @use(new AuthMiddleware())
    getForm(req: Request, res: Response) {
        return res.json(this.formsService.getFormById(req.params.id));
    }

    @get("/")
    getAllForms(req: Request, res: Response) {
    }
}
