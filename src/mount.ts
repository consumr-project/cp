import * as express from 'express';
import * as QueryService from 'query-service';
import Elasticsearch = require('elasticsearch');
import config = require('acm');

import { fuzzy, search } from './searcher';
import { query } from './queryer';

var app = express();
var es = new Elasticsearch.Client({ host: config('elasticsearch.host') });

var sql_name_search = `
select *
from users
where name like :q
`;

app.get('/fuzzy', search(es, fuzzy));
app.get('/query', query(QueryService.conn, sql_name_search));

!module.parent && app.listen(config('port'));
export = app;
