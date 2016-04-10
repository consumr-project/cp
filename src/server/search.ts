import * as express from 'express';
import { conn } from './query';
import { sql, query } from '../service/query/query';
import { fuzzy, search } from '../service/search/searcher';

import Elasticsearch = require('elasticsearch');
import config = require('acm');

export var app = express();
export var es = new Elasticsearch.Client({ host: config('elasticsearch.host') });

app.get('/fuzzy', search(es, fuzzy));
app.get('/query', query(conn, sql('search')));
