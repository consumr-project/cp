///<reference path="../typings/main.d.ts" />

type CPServiceRequestHandler = (Request, Response, Function) => void;

declare var i18n: any;

declare var TCP_BUILD_CONFIG: {
    features: any;
    analytics: { gaid: string; };
    environment: { name: string; };
    rollbar: { token: string; };
    locate: { dateFormat: string; };
}

interface CPServiceResultMetadata {
    ok: boolean;
    took?: number;
}

interface CPSearchServiceResultMetadata {
    timed_out: boolean;
    took: number;
    total: number;
}

interface CPServiceResponseV1<T> {
    body: T | Array<T> | { [index: string]: T };
    meta: CPServiceResultMetadata | CPSearchServiceResultMetadata | any
}

declare module "acm" {
    function fn<T>(str: string): T | Object | string | any;
    export = fn;
}

declare module "deep-get-set" {
    function deep<T>(holder: any, prop: string, val?: T): T;
    export = deep;
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
    import {Sequelize} from 'sequelize';

    export type QueryResult = any;

    export interface Model {
        findOne?(query: Object): Promise<Model>;
        findById?(id: string): Promise<Model>;
        findOrCreate?({where: Object, defaults: Model}): Promise<Model>;
    }

    export interface User extends Model {
        id: string;
        role: string;
        auth_linkedin_id: string;
        avatar_url: string;
        company_name: string;
        created_by: string;
        created_date: Date | number;
        email?: string;
        lang: string;
        last_login_date: Date | number;
        linkedin_url: string;
        name: string;
        summary: string;
        title: string;
        updated_by: string;
        updated_date: Date | number;
    }

    export interface Company extends Model {
    }

    export var conn: Sequelize;

    export var models: {
        User: User,
        Company: Company,
    }
}

declare module "elasticsearch" {
    interface Query {
        from?: number;
        index: string;
        size?: number;
        type: string;
        body: {
            query: {
                fuzzy_like_this?: {
                    fuzziness: number | string;
                    like_text: string;
                }
            }
        }
    }

    export interface Hit {
        _index: string;
        _type: string;
        _id: string;
        _score: number;
        _source: any;
    }

    export interface Results {
        took: number;
        timed_out: boolean;

        _shards: {
            total: number;
            successful: number;
            failed: number;
        };

        hits: {
            total: number;
            max_score: number;
            hits: Array<Hit>
        };
    }

    export class Client {
        constructor({ host: string });
        search(query: Query): Promise<Results>;
    }
}

declare module "node-uuid" {
    interface UUIDOptions {
        node?: any[];
        clockseq?: number;
        msecs?: number|Date;
        nsecs?: number;
    }

    interface UUID {
        v1(options?: UUIDOptions): string;
        v1(options?: UUIDOptions, buffer?: number[], offset?: number): number[];

        v2(options?: UUIDOptions): string;
        v2(options?: UUIDOptions, buffer?: number[], offset?: number): number[];

        v3(options?: UUIDOptions): string;
        v3(options?: UUIDOptions, buffer?: number[], offset?: number): number[];

        v4(options?: UUIDOptions): string;
        v4(options?: UUIDOptions, buffer?: number[], offset?: number): number[];

        parse(id: string, buffer?: number[], offset?: number): number[];

        unparse(buffer: number[], offset?: number): string;
    }

    export = UUID;
}

declare module "passport-localapikey" {
    import { Request } from 'express';

    export interface Search {
        (apikey: string, done: (err?: Error) => void): void;
    }

    export class Strategy {
        constructor(fn: Search);
        authenticate(req: Request, options?: Object): void;
    }
}

declare module "passport-linkedin-oauth2" {
    import { Request } from 'express';

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
            firstName: string;
            lastName: string;
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
        authenticate(req: Request, options?: Object): void;
        _callbackURL: string;
    }
}

declare module "rbac-interface" {
    export interface Allowed {
        (err?: Error, allowed?: Boolean): void;
    }

    export interface Configuration {
        roles: string[];
        permissions: { [index: string]: string[] };
        grants: { [index: string]: string[] };
    }
}

declare module "rbac" {
    import { Allowed, Configuration } from 'rbac-interface';

    class RBAC {
        constructor(config: Configuration);
        can(role: string, action: string, resource: string, fn: Allowed): void;
    }

    export = RBAC;
}

declare module "wikipedia" {
    export interface WikipediaResult {}

    export interface WikipediaRequest {
        action?: string;
        exintro?: string;
        explaintext?: string;
        format?: string;
        list?: string;
        prop?: string;
        rvprop?: string;
        rvsection?: string;
        srlimit?: string;
        srprop?: string;
        srsearch?: string;
        title?: string;
        titles?: string;
    }

    export interface WikipediaSearchResponse {
        batchcomplete: string;
        query: {
            pages: { [index: string]: WikipediaResponsePage };
        };
    }

    export interface WikipediaResponsePage {
        pageid: number;
        title: string;
        extract?: string;
        snippet?: string;
        revisions?: {
            contentformat: string;
            contentmodel: string;
            '*': string;
        }[]
    }

    export interface WikipediaExtract extends WikipediaResult {
        id: number;
        title: string;
        extract: string;
    }

    export interface WikipediaSearchResult extends WikipediaResult {
        title: string;
        snippet: string;
    }
}

declare module "embedly" {
    export interface EmbedlyRequest {
        key: string;
        url: string;
        maxwidth: number;
        maxheight: number;
    }

    export interface EmbedlyResponse {
        description: string;
        keywords: EmbedlyScoredWord[];
        entities: EmbedlyScoredWord[];
        published: string;
        title: string;
        type: string;
        url: string;
    }

    export interface EmbedlyScoredWord {
        score?: number;
        count?: number;
        name: string;
    }

    export interface EmbedlyPageResponse {
        description: string;
        keywords: string[];
        published: string;
        title: string;
        type: string;
        url: string;
    }
}

declare module "trello-interface" {
    export type ErrorMessage = string;
    export type Ack = Object;

    export interface Card {
        id: string;
        name: string;
        desc: string;
        closed: boolean;

        due?: boolean;
        email?: string;
        idAttachmentCover?: string;
        idBoard: string;
        idChecklists: string[];
        idList: string[];
        idMembers: string[];
        idShort: number;
        labels: any[];
        manualCoverAttachment: boolean;
        pos: number;
        shortUrl: string;
        stickers: any[]
        url: string;

        checkItemStates: any[];
        dateLastActivity: Date | string;
        descData: {
            emoji: any;
        };

        badges: {
            votes: number;
            viewingMemberVoted: boolean;
            subscribed: boolean;
            fogbugz: string;
            checkItems: number;
            checkItemsChecked: number;
            comments: number;
            attachments: number;
            description: boolean;
            due?: boolean;
        };
    }
}

declare module "trello" {
    import { Card, Ack, ErrorMessage } from 'trello-interface';

    class Trello {
        constructor(key: string, token: string);
        addCard(name: string, description: string, listId: string): Promise<ErrorMessage | Card>;
        getCard(boardId: string, cardId: string): Promise<ErrorMessage | Card>;
        deleteCard(cardId: string): Promise<ErrorMessage | Ack>;
    }

    export = Trello;
}
