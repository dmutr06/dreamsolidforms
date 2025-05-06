import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { Controller } from "../lib/controller";
import { get } from "../lib/decorators";
import { TYPES } from "../inversify.types";
import { IFormsService } from "./forms.service.interface";

@injectable()
export class FormsController extends Controller {
    constructor(@inject(TYPES.FormsService) private formsService: IFormsService) {
        super();
    }
    
    @get("/:id")
    getForm(req: Request, res: Response) {
        return res.json(this.formsService.getFormById(req.params.id));
    }
}
