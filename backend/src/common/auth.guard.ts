import { Response } from "express";
import { Middleware } from "../types";
import { NextFunction } from "express-serve-static-core";
import { MaybeAuthedRequest } from "./customRequest";
import { HttpError } from "./httpError";

export class AuthGuard implements Middleware {
    execute(req: MaybeAuthedRequest, _res: Response, next: NextFunction) {
        if (!req.user) throw new HttpError(401, "Unauthorized");

        next();
    }
}
