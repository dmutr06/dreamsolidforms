import { RequestHandler } from "express";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export interface Middleware {
    execute: RequestHandler,
}

export interface Route {
    method: HttpMethod,
    path: string,
    handler: string,
    middlewares: RequestHandler[],
}
