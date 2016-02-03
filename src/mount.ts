import * as express from 'express';
import * as QueryService from 'query-service';
import Elasticsearch = require('elasticsearch');
import config = require('acm');

import { fuzzy, search } from './searcher';
import { query } from './queryer';

var app = express();
var es = new Elasticsearch.Client({ host: config('elasticsearch.host') });

app.get('/fuzzy', search(es, fuzzy));
app.get('/query', query(QueryService.conn,
    'select * from users where name like :name'));

!module.parent && app.listen(config('port'));
export = app;
