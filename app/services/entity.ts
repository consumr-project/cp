/// <reference path="../../typings/firebase/firebase.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../../typings/q/Q.d.ts"/>

import {keys, each} from 'lodash';

export function get(store: Firebase, guid: string): Q.Promise<any> {
    var def: Q.Deferred<any> = Q.defer();
    store.child(guid).once('value', def.resolve, def.reject);
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

    each(fields, function (field) {
        ref.child(field).set(data[field] || '');
    });

    ref.child('modifiedDate').set(now, function (err) {
        if (err) {
            def.reject(err);
        } else {
            def.resolve(ref);
        }
    });

    if (data.createdDate) {
        ref.child('createdDate').set(data.createdDate);
    } else {
        ref.child('createdDate').once('value', function (createdDate) {
            if (!createdDate.val()) {
                ref.child('createdDate').set(now);
            }
        });
    }

    return def.promise;
}
