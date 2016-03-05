///<reference path="../typings/main.d.ts" />

declare module "acm" {
    function fn(str: string): string;
    export = fn;
}

interface CPServiceResponseV1<T> {
    body: T | Array<T> | { [index: string]: T };
    meta?: any;
}
