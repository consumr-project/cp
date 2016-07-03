import * as express from 'express';
import es from '../service/elasticsearch';

import { conn } from './record';
import { sql, query } from '../record/query';
import { fuzzy, normalize, IDX_RECORD } from '../search/searcher';
import { service_handler } from '../utilities';

export var app = express();

app.get('/query', query(conn, sql('search')));
app.get('/fuzzy', service_handler(req => fuzzy(es(), {
    index: IDX_RECORD,
    query: req.query.q,
    type: ['companies', 'users', 'tags'],
}), normalize));
