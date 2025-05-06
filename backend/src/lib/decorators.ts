import { RequestHandler } from "express";
import { HttpMethod, Middleware, Route } from "../types";

const MIDDLEWARES = Symbol("middlewares");

export function route(method: HttpMethod, path: string): MethodDecorator {
    return (target, propKey) => {
        const existingRoutes: Route[] = Reflect.getMetadata("routes", target.constructor) || [];
        const middlewares: RequestHandler[] = Reflect.getMetadata(MIDDLEWARES, target, propKey) || [];
        Reflect.defineMetadata(
            "routes",
            [...existingRoutes, { method, path, handler: propKey as string, middlewares }],
            target.constructor
        );
    }
}

export function get(path: string): MethodDecorator {
    return route("get", path);
}

export function post(path: string): MethodDecorator {
    return route("post", path);
}

export function delet(path: string): MethodDecorator {
    return route("delete", path);
}
export function put(path: string): MethodDecorator {
    return route("put", path);
}
export function patch(path: string): MethodDecorator {
    return route("patch", path);
}

export function use(...mws: (RequestHandler | Middleware)[]): MethodDecorator {
    return (target, propKey) => {
        const existingMiddlewares: RequestHandler[] = Reflect.getMetadata(MIDDLEWARES, target, propKey) || [];

        const newHandlers = mws.map(mw => typeof mw === "function" ? mw : mw.execute.bind(mw));

        Reflect.defineMetadata(MIDDLEWARES, [...existingMiddlewares, newHandlers], target, propKey);
    }
}
