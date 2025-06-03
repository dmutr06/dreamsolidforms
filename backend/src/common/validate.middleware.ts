import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import type { Request, Response, NextFunction } from "express";
import { Middleware } from "../types";
import { HttpError } from "./httpError";

export class ValidateMiddlleware<T extends object> implements Middleware {
    constructor(private dtoClass: new () => T) {}

    async execute(req: Request, _res: Response, next: NextFunction) {
        const instance = plainToInstance(this.dtoClass, req.body);

        const errors = await validate(instance);

        if (errors.length > 0) {
            const constraints = Object.values(errors[0].constraints || {});
            if (constraints.length == 0)
                throw new HttpError(400, "Validation failed");
            throw new HttpError(400, constraints[0]);
        }

        req.body = instance;
        next();
    }
}
