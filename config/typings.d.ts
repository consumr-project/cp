///<reference path="../typings/main.d.ts" />

/* type CPServiceRequestHandler = (Request, Response, Function) => void; */
/*  */
/* interface CPSearchServiceResultMetadata { */
/*     timed_out: boolean; */
/*     took: number; */
/*     total: number; */
/* } */
/*  */
/* interface CPServiceResponseV1<T> { */
/*     body: T | Array<T> | { [index: string]: T }; */
/*     meta: CPSearchServiceResultMetadata */
/* } */

declare module "acm" {
    function fn(str: string): any;
    export = fn;
}

/* declare module "query-service" { */
/*     import {Sequelize} from 'sequelize'; */
/*  */
/*     export type QueryResult = any; */
/*  */
/*     export interface Model { */
/*         findOne(query: { where: any }); */
/*     } */
/*  */
/*     export interface User extends Model { */
/*         avatar_url?: string; */
/*         email?: string; */
/*     } */
/*  */
/*     export interface Company extends Model { */
/*     } */
/*  */
/*     export var conn: Sequelize; */
/*  */
/*     export var models: { */
/*         User: User, */
/*         Company: Company, */
/*     } */
/* } */
/*  */
/* declare module "elasticsearch" { */
/*     interface Promise { */
/*         then(any): Promise; */
/*         catch(any): Promise; */
/*     } */
/*  */
/*     interface Query { */
/*         from?: number; */
/*         index: string; */
/*         size?: number; */
/*         type: string; */
/*         body: { */
/*             query: { */
/*                 fuzzy_like_this?: { */
/*                     fuzziness: number | string; */
/*                     like_text: string; */
/*                 } */
/*             } */
/*         } */
/*     } */
/*  */
/*     export interface Hit { */
/*         _index: string; */
/*         _type: string; */
/*         _id: string; */
/*         _score: number; */
/*         _source: any; */
/*     } */
/*  */
/*     export interface Results { */
/*         took: number; */
/*         timed_out: boolean; */
/*  */
/*         _shards: { */
/*             total: number; */
/*             successful: number; */
/*             failed: number; */
/*         }; */
/*  */
/*         hits: { */
/*             total: number; */
/*             max_score: number; */
/*             hits: Array<Hit> */
/*         }; */
/*     } */
/*  */
/*     export class Client { */
/*         constructor({ host: string }); */
/*         search(query: Query): Promise; */
/*     } */
/* } */

declare module "passport-linkedin-oauth2" {
    export interface Configuration {
        callbackURL: string;
        clientID: string;
        clientSecret: string;
        profileFields: string[];
        scope: string[];
    }

    export interface Search {
        (token: string, secret: string, profile: Profile, done: (err?: Error) => void): void;
    }

    export interface Profile {
        id: string;
        displayName: string;
        _json: {
            pictureUrl: string;
            emailAddress: string;
            publicProfileUrl: string;
            summary: string;
            headline: string;
            positions: {
                values: Array<{
                    company: {
                        name: string;
                    }
                }>
            }
        }
    }

    export class Strategy {
        constructor(config: Configuration, fn: Search);
    }
}

declare module "rbac" {
    interface Allowed {
        (err?: Error, allowed?: Boolean): void;
    }

    interface Configuration {
        roles: string[];
        permissions: { [index: string]: string[] };
        grants: { [index: string]: string[] };
    }

    class RBAC {
        constructor(config: Configuration);
        can(role: string, action: string, resource: string, fn: Allowed): void;
    }

    export = RBAC;
}
