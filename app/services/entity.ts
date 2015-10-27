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
        store: store,

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
        now: number = new Date().valueOf(),
        ref: Firebase;

    if (!data.guid) {
        def.reject(new Error('Missing required property: guid'));
        return def.promise;
    }

    ref = store.child(data.guid);
    fields = fields || keys(data);
    each(fields, (field) => ref.child(field).set(data[field] || ''));

    ref.child('modifiedDate').set(now, (err) => {
        if (err) {
            def.reject(err);
        } else {
            def.resolve(ref);
        }
    });

    if (data.createdDate) {
        ref.child('createdDate').set(data.createdDate);
    } else {
        ref.child('createdDate').once('value', (createdDate) => {
            if (!createdDate.val()) {
                ref.child('createdDate').set(now);
            }
        });
    }

    return def.promise;
}
