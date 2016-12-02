///<reference path="../typings/main.d.ts" />

declare module 'cp/record' {
    import { Model as RealModel } from 'sequelize';

    type FindOrCreate = { where?: Object, defaults?: Model };
    export type QueryResult = any;
    export type AnyModel = RealModel<any, any>;

    export interface Model {
        findOne?(query: Object): Promise<Model>;
        findById?(id: string): Promise<Model>;
        findOrCreate?(options: FindOrCreate): Promise<Model>;
    }

    export interface StampedModel {
        created_by?: string;
        created_date?: Date | number;
        updated_by?: string;
        updated_date?: Date | number;
        deleted_by?: string;
        deleted_date?: Date | number;
    }

    export interface IdentifiableModel extends StampedModel {
        id: string;
    }

    export enum FeedbackType {
        question,
        suggestion,
        problem
    }

    export interface Feedback extends IdentifiableModel {
        user_id: string;
        message: string;
        referrer: string;
        type: FeedbackType;
    }
}

declare module 'acm' {
    function config<T>(str: string): T | Object | string | any;
    namespace config {}
    export = config;
}

declare module 'deep-get-set' {
    function deep<T>(holder: any, prop: string, val?: T): T;
    export = deep;
}

declare module 'striptags' {
    function fn(html: string): string;
    export = fn;
}

declare module 'request' {
    interface Request {
        uri: string;
        qs?: string | {};
        method?: string;
        formData?: Object;
    }

    function fn(req: Request, callback: Function): void;
    namespace fn {}
    export = fn;
}

declare module 'urijs' {
    export function withinString(source: string, callback: (uri: string) => any): any[];
}

declare module 'imgur' {
    namespace imgur {
        // https://api.imgur.com/models/basic
        export interface BasicResponse<T> {
            success: boolean;
            status: number;
            data: T;
        }

        // https://api.imgur.com/models/image
        export interface ImageModel {
            id: string;
            link: string;
        }

        export function setCredentials(username: string, password: string, client_id: string): void;
        export function uploadBase64(img: string, album?: string): Promise<BasicResponse<ImageModel>>;
    }

    export = imgur;
}

declare module 'md5' {
    function md5(str: string): string;
    namespace md5 {}
    export = md5;
}

declare module 'elasticsearch' {
    type Connection = {
      host: string;
      apiVersion: number;
    };

    interface QueryBody {
        bool?: {
            minimum_should_match: number | string;
            should?: {
                prefix?: {
                    [field: string]: {
                        value: string;
                        boost?: number;
                    };
                };

                multi_match?: {
                    fields: string[];
                    query: string;
                    fuzziness?: number;
                };

                fuzzy?: {
                    [field: string]: {
                        value: string;
                        fuzziness?: number | string;
                        prefix_length?: number | string;
                    };
                };
            }[];
        };
    }

    interface Query {
        from?: number;
        index: string;
        size?: number;
        type: string;
        body: {
            query?: QueryBody;

            suggest?: {
                [query: string]: {
                    text: string;
                    term: {
                        min_word_length: number;
                        size: number;
                        field: string;
                    };
                };
            };
        };
    }

    export interface Suggestion {
        text: string;
        score: number;
        freq: number;
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

        hits?: {
            total: number;
            max_score: number;
            hits: Hit[];
        };

        suggest?: {
            [query: string]: {
                text?: string;
                offset?: number;
                length?: number;
                options: Suggestion[];
            }[];
        };
    }

    export interface Ack {
        took: number;
        errors: boolean;
        items: any[];
    }

    export interface Index {
        _index: string;
        _type: string;
        _id: string | number;
    }

    export interface BulkUpdate {
        body: string;
    }

    export class Client {
        constructor(conn: Connection);
        search(query: Query): Promise<Results>;
        bulk(update: BulkUpdate): Promise<Ack>;
    }
}

declare module 'shasum' {
    function fn(str: any, algo?: string, format?: string): string;
    export = fn;
}

declare module 'node-uuid' {
    interface UUIDOptions {
        node?: any[];
        clockseq?: number;
        msecs?: number|Date;
        nsecs?: number;
    }

    namespace UUID {
        export function v1(options?: UUIDOptions): string;
        export function v1(options?: UUIDOptions, buffer?: number[], offset?: number): number[];

        export function v2(options?: UUIDOptions): string;
        export function v2(options?: UUIDOptions, buffer?: number[], offset?: number): number[];

        export function v3(options?: UUIDOptions): string;
        export function v3(options?: UUIDOptions, buffer?: number[], offset?: number): number[];

        export function v4(options?: UUIDOptions): string;
        export function v4(options?: UUIDOptions, buffer?: number[], offset?: number): number[];

        export function parse(id: string, buffer?: number[], offset?: number): number[];

        export function unparse(buffer: number[], offset?: number): string;
    }

    export = UUID;
}

declare module 'passport-localapikey' {
    import { Request } from 'express';

    export interface Search {
        (apikey: string, done: (err?: Error) => void): void;
    }

    export class Strategy {
        constructor(fn: Search);
        authenticate(req: Request, options?: Object): void;
    }
}

declare module 'passport-linkedin-oauth2' {
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
            pictureUrls: { values: string[] };
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
        };
    }

    export class Strategy {
        constructor(config: Configuration, fn: Search);
        authenticate(req: Request, options?: Object): void;
        _callbackURL: string;
    }
}

declare module 'rbac-interface' {
    export interface Allowed {
        (err?: Error, allowed?: Boolean): void;
    }

    export interface Configuration {
        roles: string[];
        permissions: { [index: string]: string[] };
        grants: { [index: string]: string[] };
    }
}

declare module 'rbac' {
    import { Allowed, Configuration } from 'rbac-interface';

    class RBAC {
        constructor(config: Configuration);
        can(role: string, action: string, resource: string, fn: Allowed): void;
    }

    export = RBAC;
}

declare module 'wikipedia' {
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
        }[];
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

declare module 'embedly' {
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

declare module 'trello-interface' {
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
        stickers: any[];
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

declare module 'trello' {
    import { Card, Ack, ErrorMessage } from 'trello-interface';

    class Trello {
        constructor(key: string, token: string);
        addCard(name: string, description: string, listId: string): Promise<ErrorMessage | Card>;
        getCard(boardId: string, cardId: string): Promise<ErrorMessage | Card>;
        deleteCard(cardId: string): Promise<ErrorMessage | Ack>;
    }

    export = Trello;
}

declare module 'true-visibility' {
    function fn(elem: Element): Boolean;
    export = fn;
}

declare module 'express-rate-limit' {
    namespace RateLimit {
        export interface RateLimitConfiguration {
            windowMs: number;
            delayAfter?: number;
            delayMs?: number;
            max: number;
            message?: string;
            statusCode?: number;
            headers?: boolean;
        }
    }

    class RateLimit {
        constructor(config: RateLimit.RateLimitConfiguration);
    }

    export = RateLimit;
}

declare module 'nodemailer-plugin-inline-base64' {
    import { Plugin } from 'nodemailer';
    const base64: Plugin;
    namespace base64 {}
    export = base64;
}

declare module 'nodemailer-html-to-text' {
    import { Plugin } from 'nodemailer';
    namespace html_to_text {
        export const htmlToText: () => Plugin;
    }
    export = html_to_text;
}
