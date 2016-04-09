import Message, { TYPE as MessageType } from './message';
import { MongoCallback } from 'mongodb';
import { clone } from 'lodash';
import { Collection } from 'mongodb';

export enum TYPE {
    MISSING_INFORMATION
};

export function push(coll: Collection, subject: string, to: string, payload: any, cb: Function) {
    let type = MessageType.NOTIFICATION;
    coll.insertOne(new Message({ subject, payload, to, type }), cb);
}

export function find(coll: Collection, subject: string, extra: any | MongoCallback<Message[]>, cb?: MongoCallback<Message[]>) {
    var query;

    if (!cb && extra && extra instanceof Function) {
        cb = extra;
        extra = {};
    }

    query = clone(extra || {});
    query.type = MessageType.NOTIFICATION;

    if (subject) {
      query.subject = subject;
    }

    coll.find(query).toArray(cb);
}

export function remove(coll: Collection, id: string, to: string, cb: Function) {
    coll.deleteOne({id, to}, function () {
        console.log(arguments);
        cb();
    });
}
