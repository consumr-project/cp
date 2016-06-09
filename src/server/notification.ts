import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { ServiceRequestHandler } from 'cp';
import { BadRequestError, ERR_MISSING_FIELDS } from '../errors';
import { has_all_fields } from '../utilities';

import * as express from 'express';
import * as debug from 'debug';
import { pick } from 'lodash';
import config = require('acm');

import { TYPE } from '../notification/notification';
import * as NotificationsApi from '../notification/notification';

const COLLECTION = config('mongo.collections.notifications');
const FIELDS_MISSING_INFORMATION = [
    'id',
    'type',
    'name',
    'fields',
    'for_id',
    'for_type',
    'for_name',
];

var __coll__;
var log = debug('service:notification');
var push = pass_coll(NotificationsApi.push);
var find = pass_coll(NotificationsApi.find);
var remove = pass_coll(NotificationsApi.remove);

export var app = express();

app.use((req: Request, res: Response, next: Function) =>
    next(req.user && req.user.id ? null :
        new Error('Authentication required')));

app.get('/notifications', (req, res, next) =>
    find_for(null, req, res, next));

app.post('/notifications/missing_information',
    gen_post(TYPE.MISSING_INFORMATION, FIELDS_MISSING_INFORMATION));

app.delete('/notifications/:id', (req, res, next) =>
    remove(req.params.id, req.user.id, err =>
        err ? next(err) : res.json({ ok: true })));

export function connect(cb: Function = () => {}) {
    log('connecting to mongodb');
    MongoClient.connect(config('mongo.url'), (err, db) => {
        if (err) {
            log('error connecting to mongo');
            log(err);
        } else {
            log('connected to mongodb');
            log('pushing notifications to %s collection', COLLECTION);
            __coll__ = db.collection(COLLECTION);
        }

        cb(err, db);
    });
}

function gen_post(type: TYPE, fields: string[]): ServiceRequestHandler {
    return (req, res, next) => {
        !has_all_fields(fields, req.body) ?
            next(new BadRequestError(ERR_MISSING_FIELDS(fields))) :
            push(type, req.user.id, pick(req.body, fields), (err, items) =>
                find_for(type, req, res, next));
    };
}

function find_for(type: TYPE, req: Request, res: Response, next: Function) {
    find(type, { to: req.user.id },
        (err, items) => err ? next(err) : res.json(items));
}

function pass_coll(fn: Function) {
    return function (...args) {
        if (!__coll__) {
            log('mongodb connection not yet initialized');
            throw new Error('mongodb connection not yet initialized');
        }

        fn.apply(null, [__coll__].concat(args));
    };
}
