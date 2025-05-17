import express, { Router } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "./inversify.types";
import { Controller } from "./lib/controller";
import path from "path";

@injectable()
export class App {
    app = express();

    constructor(
        @inject(TYPES.UsersController) private usersController: Controller,
        @inject(TYPES.FormsController) private formsController: Controller) 
    {}

    private useStatic() {
        this.app.use("/", express.static(path.join(__dirname, "..", "public"))); 
        this.app.use("*$", (_, res) => res.sendFile(path.join(__dirname, "..", "public", "index.html")));
    }

    private useMiddlewares() {
        this.app.use(express.json());
    }

    private useRoutes() {
        const router = Router();
        router.use("/users", this.usersController.buildRouter());
        router.use("/forms", this.formsController.buildRouter());

        this.app.use("/api", router);
    }

    public async run(port: number) {
        this.useMiddlewares();
        this.useRoutes();
        this.useStatic();

        this.app.listen(6969, () => {
            console.log(`Server has been started on port ${port}`);
        });
    }
}
