import { MongoClient } from 'mongodb';
import * as debug from 'debug';

const config = require('acm');
const log = debug('service:notification');

const MONGO_COLL = config('mongo.collections.notifications');
const MONGO_URL = config('mongo.url');

var __coll__;

export default function (cb: Function = () => {}) {
    log('connecting to mongodb');
    MongoClient.connect(MONGO_URL, (err, db) => {
        if (err) {
            log('error connecting to mongo');
            log(err);
        } else {
            log('connected to mongodb');
            log('pushing notifications to %s collection', MONGO_COLL);
            __coll__ = db.collection(MONGO_COLL);
        }

        cb(err, __coll__);
    });
}
