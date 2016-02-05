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
/*  */
/* declare module "acm" { */
/*     function fn(str: string): string; */
/*     export = fn; */
/* } */
/*  */
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
