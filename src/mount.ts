import * as express from 'express';
import config = require('acm');
import Elasticsearch = require('elasticsearch');

import { fuzzy, search } from './searcher';

var app = express();
var es = new Elasticsearch.Client({ host: config('elasticsearch.host') });

app.get('/fuzzy', search(es, fuzzy));

!module.parent && app.listen(config('port'));
export = app;
