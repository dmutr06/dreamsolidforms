import { RequestHandler, Router } from "express";
import { Route } from "../types";
import { injectable } from "inversify";

@injectable()
export abstract class Controller {
    public buildRouter(): Router {
        const router = Router();
        const routes: Route[] = Reflect.getMetadata("routes", this.constructor) || [];

        for (const { method, path, handler, middlewares } of routes) {
            router[method](path, [...middlewares, (this as unknown as Record<string, RequestHandler>)[handler].bind(this)]);
        }

        return router;
    }
}
