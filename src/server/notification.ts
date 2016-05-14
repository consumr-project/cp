import * as express from 'express';
import { Request, Response } from 'express';
import * as debug from 'debug';
import * as NotificationsApi from '../notification/notification';
import { add_card_handler } from '../notification/trello';
import { MongoClient } from 'mongodb';
import { pick } from 'lodash';
import config = require('acm');

const MISSING_INFO_FIELDS = [
    'obj_id',
    'obj_type',
    'obj_name',
    'obj_fields',
    'obj_for_id',
    'obj_for_type',
    'obj_for_name',
];

const NOTIFICATIONS_COLLECTION = config('mongo.collections.notifications');

const MISSING_INFO_FIELDS_ERR =
    new Error(`Missing data. Required: ${MISSING_INFO_FIELDS.join(', ')}`);

const Notifications = {
    TYPE: NotificationsApi.TYPE,
    push: pass_coll(NotificationsApi.push),
    find: pass_coll(NotificationsApi.find),
    remove: pass_coll(NotificationsApi.remove),
};

var log = debug('service:notification');
var __coll__;

export var app = express();

app.use((req: Request, res: Response, next: Function) =>
    next(req.user && req.user.id ? null :
        new Error('Authentication required')));

app.get('/notifications', (req, res, next) =>
    find_for(null, req, res, next));

app.get('/notifications/missing_information', (req, res, next) =>
    find_for(Notifications.TYPE.MISSING_INFORMATION, req, res, next));

app.post('/notifications/missing_information', (req, res, next) =>
    !validate_missing_info_message(req.body) ? next(MISSING_INFO_FIELDS_ERR) :
        Notifications.push(Notifications.TYPE.MISSING_INFORMATION,
            req.user.id, pick(req.body, MISSING_INFO_FIELDS),
            (err, items) => find_for(Notifications.TYPE.MISSING_INFORMATION, req, res, next)));

app.delete('/notifications/:id', (req, res, next) =>
    Notifications.remove(req.params.id, req.user.id, err =>
        err ? next(err) : res.json({ ok: true })));

app.post('/trello/card', add_card_handler);

export function connect(cb: Function = () => {}) {
    log('connecting to mongodb');
    MongoClient.connect(config('mongo.url'), (err, db) => {
        if (err) {
            log('error connecting to mongo');
            log(err);
        } else {
            log('connected to mongodb');
            log('pushing notifications to %s collection', NOTIFICATIONS_COLLECTION);
            __coll__ = db.collection(NOTIFICATIONS_COLLECTION);
        }

        cb(err, db);
    });
}

function validate_missing_info_message(data: any) {
    return data.obj_id && data.obj_type && data.obj_name && data.obj_fields &&
        data.obj_for_id && data.obj_for_type && data.obj_for_name;
}

function find_for(type: NotificationsApi.TYPE, req: Request, res: Response, next: Function) {
    Notifications.find(type, { to: req.user.id },
        (err, items) => err ? next(err) : res.json(items));
}

function coll_check() {
    if (!__coll__) {
        log('mongodb connection not yet initialized');
        throw new Error('mongodb connection not yet initialized');
    }
}

function pass_coll(fn: Function) {
    return function (...args) {
        coll_check();
        fn.apply(null, [__coll__].concat(args));
    };
}
