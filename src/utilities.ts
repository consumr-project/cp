import { Request } from 'express';
import { ServiceRequestHandler, ServiceResultMetadata,
    ServiceResponseV1 } from 'cp';

export function make_enum_entry(store: Object, val: string): Object {
    store[val.toUpperCase()] = val;
    return store;
}

export function make_enum(items: string[]): any {
    return items.reduce(make_enum_entry, {});
}

export function get_or_else<T>(val: T, def: T): T {
    return val === undefined || val === null ? def : val;
}

export function get_url_parts(raw: string): string[] {
    return (raw || '').split(',');
}

export function service_response<T>(body: T, ok: Boolean = true, meta: ServiceResultMetadata | any = {}): ServiceResponseV1<T> {
    meta.ok = ok;
    return { body, meta };
}

export function service_handler<T>(from_req: (Request) => Promise<T>): ServiceRequestHandler {
    return (req, res, next) => {
        from_req(req)
            .then(body => res.json(service_response(body)))
            .catch(next);
    };
}

export function service_redirect<T>(from_req: (Request) => Promise<T>): ServiceRequestHandler {
    return (req, res, next) => {
        from_req(req)
            .then(url => res.redirect(url))
            .catch(next);
    };
}
