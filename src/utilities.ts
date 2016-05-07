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
