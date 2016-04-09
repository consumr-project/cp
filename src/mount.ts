import * as express from 'express';
import config = require('acm');
import avatar from './avatar';

var query_service;
var app = express();
export = app;

app.get('/avatar', avatar);

if (!module.parent) {
    query_service = require('query-service');
    query_service.conn.sync();
    app.listen(config('port') || 3000);
}
