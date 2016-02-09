import { Model } from 'sequelize';
import * as debug from 'debug';
import * as body from 'body-parser';
import * as express from 'express';

import gen_models from './models';
import gen_routes from './routes';

import Sequelize = require('sequelize');

var config = require('acm'),
    log = debug('service:query');

var app = express();
module.exports = exports = app;

export var conn = new Sequelize(config('database.url'), {
    logging: debug('service:query:exec'),
    pool: config('database.pool')
});

export var models = gen_models(conn);

app.use(body.json());
gen_routes(app, models);
