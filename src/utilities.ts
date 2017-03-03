import { Request } from 'express';
import { curryRight, set, get } from 'lodash';
import { Lambda, Duration, Millisecond, Second, Minute, Hour, Day } from './lang';

export type None = Object;
export type Maybe<T> = T;
export type Optional<T> = { get_or_else: (def: T) => T }

export const zero = (): Duration => 0;
export const milliseconds = (n: number): Duration => n * Millisecond;
export const seconds = (n: number): Duration => n * Second;
export const minutes = (n: number): Duration => n * Minute;
export const hours = (n: number): Duration => n * Hour;
export const days = (n: number): Duration => n * Day;

export const none = (): None => ({});
export const pass = <T>(val: T): T => val;

export function option<T>(val: Maybe<T>): Optional<T> {
    return {
        get_or_else: def => val === undefined || val == null ? def : val
    };
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

export function empty<T>(obj: Object | Array<T> | undefined): boolean {
    if (!obj) {
        return true;
    } else {
        return obj instanceof Array ? !!obj.length : !!Object.keys(obj).length;
    }
}

export function ellipsis(str: string, max_len: number, suffix: string = '...'): string {
    if (str.length > max_len) {
        str = str.substr(0, max_len).trim() + suffix;
    }

    return str;
}

export function truthy(val: string | Boolean): Boolean {
    return val && (val.toString() === 'true' || val.toString() === '1');
}

export function make_link(link?: string): string {
    if (!link) {
        return '';
    } else {
        return link.indexOf('http') === 0 ? link : 'http://' + link;
    }
}

export function nil(val?: any): boolean {
    return val === null || val === undefined;
}

export function curr_set<T, V>(obj: T, path: string[] | string, def?: V): (val: V) => T {
    return (val: V) => {
        set(obj, path, !nil(def) ? def : val);
        return obj;
    };
}

export function curr_get<T, V>(path: string[] | string): (obj: T) => V {
    return curryRight(get, 2)(path);
}

export function preload(
    url: string,
    callback: (ev: Event) => void,
    errback: (ev: ErrorEvent) => void
): HTMLImageElement {
    var img = new Image();
    img.onload = callback;
    img.onerror = errback;
    img.src = url;
    return img;
}

export function ternary<T, TRUE_T, FALSE_T>(
    check: Maybe<T>,
    if_true: Lambda<null, TRUE_T>,
    if_false: Lambda<null, FALSE_T> = () => undefined
): TRUE_T | FALSE_T {
    return !!check ? if_true() : if_false();
}
