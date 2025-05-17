import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Middleware } from "../types";
import { NextFunction } from "express-serve-static-core";

export class AuthMiddleware implements Middleware {
    execute(req: Request, _res: Response, next: NextFunction) {
        const token = req.cookies.token;
        if (!token) return next();

        try {
            const decoded = jwt.verify(token, process.env.SECRET!) as jwt.JwtPayload;
            (req as any).user = decoded.id;
            next();
        } catch(e) {
            next();
        }

    }
}
