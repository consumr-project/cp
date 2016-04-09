import * as express from 'express';
import * as QueryService from 'query-service';
import { readFileSync as read } from 'fs';

import Elasticsearch = require('elasticsearch');
import config = require('acm');

import { fuzzy, search } from '../service/search/searcher';
import { query } from '../service/search/queryer';

export var app = express();
var es = new Elasticsearch.Client({ host: config('elasticsearch.host') });

var sql = name =>
    read(`${__dirname}/../../config/${name}.sql`).toString();

app.get('/fuzzy', search(es, fuzzy));

// XXX move into query endpoints
app.get('/query', query(QueryService.conn, sql('search')));
