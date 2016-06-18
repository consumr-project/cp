import { Db, MongoClient } from 'mongodb';
import * as debug from 'debug';
import config = require('acm');

var connection: Db;
var connection_err: Error;

var log = debug('service:mongo');

export default function (collection: string, cb: Function = () => {}) {
    function send_back(err, conn, collection, cb) {
        if (err) {
            cb(err);
        } else {
            cb(null, conn.collection(collection));
        }
    }

    if (connection) {
        send_back(connection_err, connection, collection, cb);
    } else {
        log('connecting to mongodb');

        MongoClient.connect(config('mongo.url'), (err, db) => {
            connection = db;
            connection_err = err;

            if (err) {
                log('error connecting to mongo');
                log(err);
            } else {
                log('connected to mongodb');
            }

            send_back(connection_err, connection, collection, cb);
        });
    }
}
