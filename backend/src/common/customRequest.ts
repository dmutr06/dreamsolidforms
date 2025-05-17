import { Request } from "express";

export interface TypedRequest<T extends object = object> extends Request<{}, {}, T> {}

export interface MaybeAuthedRequest<T extends object = object> extends TypedRequest<T> {
    user?: string,
}

export interface AuthedRequest<T extends object = object> extends MaybeAuthedRequest<T> {
    user: string,
}

