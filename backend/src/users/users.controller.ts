import { inject, injectable } from "inversify";
import { Controller } from "../lib/controller";
import { get, use } from "../lib/decorators";
import { Request, Response } from "express";
import { TYPES } from "../inversify.types";
import { IUsersService } from "./users.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";

@injectable()
export class UsersController extends Controller {
    constructor(@inject(TYPES.UsersService) private usersService: IUsersService) {
        super();
    }

    @get("/me")
    @use(new AuthMiddleware())
    me(_req: Request, res: Response) {
        const a = this.usersService.getUserById("123");
        res.send(a);
    }
}
