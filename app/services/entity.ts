/// <reference path="../typings.d.ts"/>

import * as Q from 'q';
import {keys, each} from 'lodash';
import {LocalStorageCache} from 'jtils/dist/cache';

export interface Collection<T> {
    label: string;
    store: Firebase,
    get(guid: string): Q.Promise<T>;
    put(data: any, fields?: Array<string>): Q.Promise<T>;
}

function getData(data: any, fields?: Array<string>): any {
    let newData: any = {};
    each(fields || keys(data), field => newData[field] = data[field]);
    return newData;
}

export function bind<T>(label: string, store: Firebase): Collection<T> {
    var child = store.child(label),
        cache = new LocalStorageCache<T>((id) => get(child, id), `entity:${label}`);

    return {
        label: label,
        store: child,

        get: function (guid: string): Q.Promise<T> {
            return cache.get(guid);
        },

        put: function (data: any, fields?: Array<string>): Q.Promise<T> {
            return put(child, data, fields).then(() =>
                cache.set(data.guid, getData(data, fields)));
        }
    };
}

export function get(store: Firebase, guid: string): Q.Promise<any> {
    var def: Q.Deferred<any> = Q.defer();
    store.child(guid).once('value', (ref) => def.resolve(ref.val()), def.reject);
    return def.promise;
}

export function put(store: Firebase, data: any, fields?: Array<string>): Q.Promise<Firebase> {
    var def: Q.Deferred<any> = Q.defer(),
        now: number = new Date().valueOf();

    if (!data.guid) {
        def.reject(new Error('Missing required property: guid'));
        return def.promise;
    }

    store.child(data.guid).transaction(stored => {
        if (!stored) {
            stored = {};
        }

        stored.dateCreated = stored.dateCreated || Date.now();
        stored.dateModified = Date.now();

        each(fields || keys(data), field => {
            stored[field] = data[field] || stored[field] || '';
        });

        return stored;
    }, (err, committed, ref) => {
        if (err) {
            def.reject(err);
        } else {
            def.resolve(ref);
        }
    });

    return def.promise;
}
