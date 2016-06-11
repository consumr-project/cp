import { Request } from 'express';
import { ServiceRequestHandler, ServiceResultMetadata,
    ServiceResponseV1 } from 'cp';

export type None = Object;
export type Maybe<T> = None | T;
export type Optional<T> = { get_or_else: (T) => T }

export function none(): None {
    return {};
}

export function option<T>(val: Maybe<T>): Optional<T> {
    return {
        get_or_else: def => val === undefined || val == null ? def : val
    };
}

export function make_enum_entry(store: Object, val: string): Object {
    store[val.toUpperCase()] = val;
    return store;
}

export function make_enum(items: string[]): any {
    return items.reduce(make_enum_entry, {});
}

export function get_url_parts(raw: string): string[] {
    return (raw || '').split(',');
}

export function service_response<T>(body: T, ok: Boolean = true, meta: ServiceResultMetadata | any = {}): ServiceResponseV1<T> {
    meta.ok = ok;
    return { body, meta };
}

export function service_handler<T>(from_req: (req: Request) => Promise<T>): ServiceRequestHandler {
    return (req, res, next) => {
        from_req(req)
            .then(body => res.json(service_response(body)))
            .catch(next);
    };
}

export function service_redirect(from_req: (req: Request, res?, next?) => Promise<string>): ServiceRequestHandler {
    return (req, res, next) => {
        from_req(req)
            .then(url => res.redirect(url))
            .catch(next);
    };
}

export function has_all_fields(fields: string[], data: any): boolean {
    for (var i = 0, len = fields.length; i < len; i++) {
        if (!data[fields[i]]) {
            return false;
        }
    }

    return true;
}

export function group_by_day<T extends { date: string }>(items: T[]): T[][] {
    var groups = [],
        holder = {};

    var slug = (date: Date): string =>
        date.toLocaleDateString();

    items.forEach(item => {
        let key = slug(new Date(item.date));

        if (!holder[key]) {
            holder[key] = [];
        }

        holder[key].push(item);
    });

    Object.keys(holder).sort().forEach(group => {
        groups[groups.length] = holder[group];
    });

    return groups;
}
