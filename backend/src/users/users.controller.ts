import { inject, injectable } from "inversify";
import { Controller } from "../lib/controller";
import { get, post, use } from "../lib/decorators";
import { Response } from "express";
import { TYPES } from "../inversify.types";
import { IUsersService } from "./users.service.interface";
import { AuthedRequest, TypedRequest } from "../common/customRequest";
import { AuthGuard } from "../common/auth.guard";
import { ValidateMiddlleware } from "../common/validate.middleware";
import { CreateUserDto } from "./dto/createUser.dto";

@injectable()
export class UsersController extends Controller {
    constructor(@inject(TYPES.UsersService) private usersService: IUsersService) {
        super();
    }

    @post("/register")
    @use(new ValidateMiddlleware(CreateUserDto))
    async register(req: TypedRequest<CreateUserDto>, res: Response) {
        const user = await this.usersService.createUser(req.body);
        const token = await this.usersService.signIn(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600 * 24 * 1000,
        });

        res.json({ message: "Created user" });
    }

    @post("/login")
    @use(new ValidateMiddlleware(CreateUserDto))
    async login(req: TypedRequest<CreateUserDto>, res: Response) {
        const user = await this.usersService.verifyUser(req.body); 
        const token = await this.usersService.signIn(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600 * 24 * 1000,
        });

        res.json({ message: "Logged in" });
    }

    @get("/me")
    @use(new AuthGuard())
    async me(req: AuthedRequest, res: Response) {
        const id: string = req.user;
    
        const user = await this.usersService.getUserById(id);

        res.send({ user });
    }
}
