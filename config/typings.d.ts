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
