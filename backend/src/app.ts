import express, { NextFunction, Request, Response, Router } from "express";
import cookieParser from "cookie-parser";
import { inject, injectable } from "inversify";
import { TYPES } from "./inversify.types";
import { Controller } from "./lib/controller";
import path from "path";
import { AuthMiddleware } from "./common/auth.middleware";
import { HttpError } from "./common/httpError";

@injectable()
export class App {
    app = express();

    constructor(
        @inject(TYPES.UsersController) private usersController: Controller,
        @inject(TYPES.FormsController) private formsController: Controller
    ) {}

    private useStatic() {
        this.app.use(express.static(path.join(__dirname, "..", "public"))); 
        this.app.get("*$", (_, res) => res.sendFile(path.join(__dirname, "..", "public", "index.html")));
    }

    private useMiddlewares() {
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(new AuthMiddleware().execute);
    }

    private useRoutes() {
        const router = Router();
        router.use("/users", this.usersController.buildRouter());
        router.use("/forms", this.formsController.buildRouter());

        this.app.use("/api", router);
        this.app.all("/api/*$", () => { throw new HttpError(404, "Not Found") });
    }

    public async run(port: number) {
        this.useMiddlewares();
        this.useRoutes();
        this.useStatic();

        this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
            if (!err) return;

            if (err instanceof HttpError) {
                res.status(err.code).send({ statusCode: err.code, message: err.message });
            } else if (err instanceof SyntaxError) {
                res.status(400).send({ statusCode: 400, message: "Bad json" });
            } else {
                res.status(500).send({ statusCode: 500, message: "Internal server error :(" });
            }
        });

        this.app.listen(6969, () => {
            console.log(`Server has been started on port ${port}`);
        });
    }
}
