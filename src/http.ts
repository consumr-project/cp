import { Request, Response } from 'express';
import * as config from 'acm';
import * as RateLimit from 'express-rate-limit';
import { RateLimitConfiguration } from 'express-rate-limit';
import { clone } from 'lodash';
import { Lambda3, ErrorHandler } from './lang';
import { Cache } from './device/cache';

export type ServiceRequestPromise<T> = Lambda3<Request, Response, ErrorHandler, Promise<T>>;
export type ServiceRequestHandler = Lambda3<Request, Response, ErrorHandler, void>

export interface ServiceResultMetadataParts {
    took?: number;
    from_cache?: boolean;
    message?: string;
}

export interface ServiceResultMetadata extends ServiceResultMetadataParts {
    ok: boolean;
}

export interface ServiceResponseV1<T> {
    body: T | T[] | { [index: string]: T };
    meta: ServiceResultMetadata;
}

export function service_response<T>(body: T, ok: boolean = true, parts: ServiceResultMetadataParts = {}): ServiceResponseV1<T> {
    var meta = <ServiceResultMetadata>clone(parts);
    meta.ok = ok;
    return { body, meta };
}

export function service_handler<T>(from_req: ServiceRequestPromise<T>, builder = service_response): ServiceRequestHandler {
    return (req, res, next) => {
        var pro = from_req(req, res, next);

        if (pro) {
            pro.then(body => res.json(builder(body)))
                .catch(next);
        }
    };
}

export function service_middleware<T>(from_req: ServiceRequestPromise<T>): ServiceRequestHandler {
    return (req, res, next) => {
        var pro = from_req(req, res, next);

        if (pro) {
            pro.then(() => next())
                .catch(next);
        }
    };
}

export function service_redirect(from_req: ServiceRequestPromise<string>): ServiceRequestHandler {
    return (req, res, next) => {
        from_req(req, res, next)
            .then(url => res.redirect(url))
            .catch(next);
    };
}

export function service_cache_intercept<T>(cache: Cache<T>, name: string): ServiceRequestHandler {
    return (req, res, next) => {
        cache.get(name)
            .then(rec => rec ? res.json(service_response(rec, true, { from_cache: true })) : next())
            .catch(next);
    };
}

export function ratelimit(config_name: string) {
    return new RateLimit(config<RateLimitConfiguration>(`ratelimit.${config_name}`));
}
