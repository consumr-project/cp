'use strict';

var COLL;

const express = require('express');
const mongodb = require('mongodb').MongoClient;

const debug = require('debug');
const config = require('acm');
const app = express();

const Notifications = require('./src/notification');
const notifications_collection = config('mongo.collections.notifications');

var log = debug('service:notification');

// XXX bit of a hack, but this is the only way that I can reference the local
// copy of `config/rbac.yml`
config.ref.$paths.push(require('path').join(__dirname, 'config'));

/**
 * @param {Function} [cb]
 */
function connect(cb) {
    cb = cb || function () {};
    log('connecting to mongodb');
    mongodb.connect(config('mongo.url'), (err, db) => {
        log('connected to mongodb');
        log('pushing notifications to %s', notifications_collection);
        COLL = db.collection(notifications_collection);
        cb(err, db);
    });
}

/**
 * @throws {Error}
 */
function coll_check() {
    if (!COLL) {
        log('mongodb connection not yet initialized');
        throw new Error('mongodb connection not yet initialized');
    }
}

/**
* @param {Function} fn
* @return {Function(*)}
*/
function pass_coll(fn) {
    return function () {
        coll_check();
        fn.apply(null [COLL].concat(
            [].splice.call(arguments, 0)));
    };
}

module.exports = app;
module.exports.connect = connect;

module.exports.Notifications = {
    TYPE: Notifications.TYPE,
    push: pass_coll(Notifications.push),
    find: pass_coll(Notifications.find),
    get_missing_infos: pass_coll(Notifications.get_missing_infos),
};

if (!module.parent) {
    connect(() => app.listen(config('port') || 3000));
    // connect((err) => {
    //     app.listen(config('port') || 3000);
    //     Notifications.push(COLL, Notifications.TYPE.MISSING_INFORMATION, {
    //         user_id: 'b2df88fa-dd25-42ba-b456-3c8d164d3343',
    //         obj_id: 'e95c6efc-f89d-488d-959b-8d934853bb66',
    //         obj_type: 'company',
    //         fields: ['url']
    //     }, (err, items) => {
    //         Notifications.get_missing_infos(COLL, 'b2df88fa-dd25-42ba-b456-3c8d164d3343', (err, items) => {
    //             console.log(items);
    //         });
    //     });
    // });
}
