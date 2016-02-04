import * as express from 'express';
import * as QueryService from 'query-service';
import { readFileSync as read } from 'fs';
import Elasticsearch = require('elasticsearch');
import config = require('acm');

import { fuzzy, search } from './searcher';
import { query } from './queryer';

var app = express();
var es = new Elasticsearch.Client({ host: config('elasticsearch.host') });

var sql = name =>
    read(`./config/${name}.sql`).toString();

app.get('/fuzzy', search(es, fuzzy));
app.get('/query', query(QueryService.conn, sql('search')));

!module.parent && app.listen(config('port'));
export = app;
