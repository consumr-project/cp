import * as express from 'express';
import es from '../device/elasticsearch';

import { conn } from '../device/models';
import { sql, query } from '../record/query';
import { fuzzy, normalize, INDEX, TYPE } from '../search/searcher';
import { service_handler } from '../http';

export var app = express();

app.get('/query', query(conn, sql('search')));
app.get('/fuzzy', service_handler(req => fuzzy(es(), {
    index: INDEX.RECORD,
    query: req.query.q,
    type: [TYPE.COMPANIES, TYPE.USERS, TYPE.TAGS],
}), normalize));
