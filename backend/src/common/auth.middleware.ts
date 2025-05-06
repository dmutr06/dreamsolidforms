import { Request, Response } from "express";
import { Middleware } from "../types";
import { NextFunction } from "express-serve-static-core";

export class AuthMiddleware implements Middleware {
    execute(req: Request, res: Response, next: NextFunction) {
        console.log("auth mw");

        next();
    }
}
