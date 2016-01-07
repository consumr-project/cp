'use strict';

const express = require('express');
const mongodb = require('mongodb').MongoClient;

const debug = require('debug')
const config = require('acm');
const app = express();

const notification = require('./src/notification');
const notifications_collection = config('mongo.collections.notifications');

var log = debug('service:notification');

function connect(cb) {
    mongodb.connect(config('mongo.url'), (err, db) => {
        var coll = db.collection(notifications_collection);

        var find = notification.find.bind(null, coll),
            push = notification.push.bind(null, coll),
            get_missing_information_notifications = notification
                .get_missing_information_notifications.bind(null, coll);

        log('connected to mongodb');
        log('pushing notifications to %s', notifications_collection);

        cb(err, { push, find, get_missing_information_notifications });
    });
}

module.exports = app;
module.exports.connect = connect;

if (!module.parent) {
    connect(() => app.listen(config('port') || 3000));
    // connect((err, notifications) => {
    //     app.listen(config('port') || 3000);
    //     notifications.push(notification.TYPE.MISSING_INFORMATION, {
    //         user_id: 'b2df88fa-dd25-42ba-b456-3c8d164d3343',
    //         obj_id: 'e95c6efc-f89d-488d-959b-8d934853bb66',
    //         obj_type: 'company',
    //         fields: ['url']
    //     }, (err, items) => {
    //         notifications.get_missing_information_notifications('b2df88fa-dd25-42ba-b456-3c8d164d3343', (err, items) => {
    //             console.log(items);
    //         });
    //     });
    // });
}
