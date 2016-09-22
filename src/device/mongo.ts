import { Db, MongoClient } from 'mongodb';
import { logger } from '../log';
import * as config from 'acm';

var connection: Db;
var connection_err: Error;

const log = logger(__filename);

export default function (collection: string, cb: Function = () => {}) {
    var url, env = process.env;

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
        log.info('connecting to mongodb');
        url = !env.MONGO_HOST ? config('mongo.url') :
            'mongodb://' + env.MONGO_HOST + ':27017/' + env.MONGO_COLLECTION;

        MongoClient.connect(url, (err, db) => {
            connection = db;
            connection_err = err;

            if (err) {
                log.error('error connecting to mongo', err);
            } else {
                log.info('connected to mongodb');
            }

            send_back(connection_err, connection, collection, cb);
        });
    }
}
