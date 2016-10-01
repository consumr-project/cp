import * as express from 'express';
import * as config from 'acm';
import es_connect from '../device/elasticsearch';

import { conn } from '../device/models';
import { sql, query } from '../record/query';
import { fuzzy, normalize, INDEX, TYPE } from '../search/searcher';
import { service_handler } from '../http';
import { ErrorHandler } from '../lang';

export var app = express();
const es = es_connect();

app.get('/query', (req, res, next) => {
    if (config('features.search_with_elasticsearch.enabled')) {
        service_handler(req => fuzzy(es, {
            index: INDEX.RECORD,
            query: req.query.q,
            type: [TYPE.COMPANIES, TYPE.USERS, TYPE.TAGS],
        }), normalize)(req, res, <ErrorHandler>next);
    } else {
        query(conn, sql('search'))(req, res, <ErrorHandler>next);
    }
});
