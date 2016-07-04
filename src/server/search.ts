import * as express from 'express';
import es from '../service/elasticsearch';

import { conn } from './record';
import { sql, query } from '../record/query';
import { fuzzy, normalize, INDEX, TYPE } from '../search/searcher';
import { service_handler } from '../utilities';

export var app = express();

app.get('/query', query(conn, sql('search')));
app.get('/fuzzy', service_handler(req => fuzzy(es(), {
    index: INDEX.RECORD,
    query: req.query.q,
    type: [TYPE.COMPANIES, TYPE.USERS, TYPE.TAGS],
}), normalize));
