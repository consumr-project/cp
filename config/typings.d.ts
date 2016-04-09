///<reference path="../typings/main.d.ts" />

interface CPServiceResponseV1<T> {
    body: T | Array<T> | { [index: string]: T };
    meta?: any;
}

declare module "acm" {
    function fn(str: string): string;
    export = fn;
}

declare module "deep-get-set" {
    function fn(store: Object, get: string, set?: any): any;
    export = fn;
}

declare module "striptags" {
    function fn(html: string): string;
    export = fn;
}

declare module "request" {
    interface Request {
        uri: string,
        qs?: string | {},
    }

    function fn(req: Request, callback: Function);
    export = fn;
}

declare module "urijs" {
    export function withinString(source: string, callback: (uri: string) => any): any[];
}

declare module "md5" {
    function fn(str: string): string;
    export = fn;
}

declare module "query-service" {
    export interface Model {
        findOne(query: { where: any });
    }

    export interface User extends Model {
        avatar_url?: string;
        email?: string;
    }

    export var models: {
        User: User
    }
}
