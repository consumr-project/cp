import * as express from 'express';

import { conn } from './record';
import { sql, query } from '../record/query';
import { fuzzy, search } from '../search/searcher';

import Elasticsearch = require('elasticsearch');
import config = require('acm');

export var app = express();
export var es = new Elasticsearch.Client({ host: config('elasticsearch.host') });

app.get('/fuzzy', search(es, fuzzy));
app.get('/query', query(conn, sql('search')));
