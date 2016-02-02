///<reference path="../typings/main.d.ts" />

declare module "acm" {
    function fn(str: string): string;
    export = fn;
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
