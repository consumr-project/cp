import { Request, Response } from 'express';
import { clone } from 'lodash';

export type ServiceRequestHandler = (req: Request, res: Response, next: (err?: Error) => {}) => void;
export type ServiceRequestPromise<T> = (req: Request, res: Response, next: (err?: Error) => {}) => Promise<T>;

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

export function service_redirect(from_req: ServiceRequestPromise<string>): ServiceRequestHandler {
    return (req, res, next) => {
        from_req(req, res, next)
            .then(url => res.redirect(url))
            .catch(next);
    };
}
