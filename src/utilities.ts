import { Request } from 'express';
import { Dictionary } from 'lodash';

export type None = Object;
export type Maybe<T> = T;
export type Optional<T> = { get_or_else: (def: T) => T }

export function none(): None {
    return {};
}

export function pass<T>(val: T): T {
    return val;
}

export function option<T>(val: Maybe<T>): Optional<T> {
    return {
        get_or_else: def => val === undefined || val == null ? def : val
    };
}

export function make_enum_entry(store: Dictionary<string>, val: string): Object {
    store[val.toUpperCase()] = val;
    return store;
}

export function make_enum(items: string[]): any {
    return items.reduce(make_enum_entry, {});
}

export function get_url_parts(raw: string): string[] {
    return (raw || '').split(',');
}

export function has_all_fields(fields: string[], data: any): boolean {
    for (var i = 0, len = fields.length; i < len; i++) {
        if (!data[fields[i]]) {
            return false;
        }
    }

    return true;
}

export function runtime_purge_allowed(req: Request): boolean {
    return process.env.CP_PURGE_KEY &&
        req.query.purge_key === process.env.CP_PURGE_KEY;
}

export function as_array(val: Object): Object[] {
    return val instanceof Array ? val : [val];
}

export function is_set(val: any): boolean {
    return !!val;
}

export function try_func<T>(action: () => T): [Error, T] {
    var err: Error, res: T;

    try {
        res = action();
    } catch (_err) {
        err = _err;
    }

    return [ err, res ];
}

export function empty<T>(obj: Object | Array<T>): boolean {
    return obj instanceof Array ? !!obj.length : !!Object.keys(obj).length;
}
