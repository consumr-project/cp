import * as config from 'acm';
import es_connect from '../device/elasticsearch';
import { Router } from 'express';

import { conn } from '../device/models';
import { sql, query } from '../record/query';
import { fuzzy, normalize, INDEX, TYPE } from '../search/searcher';
import { service_handler } from '../http';
import { ErrorHandler } from '../lang';

const MAX_RESULTS = 200;
const min = Math.min;

export const router = Router();
const es = es_connect();

router.get('/query', (req, res, next) => {
    if (config('features.search_with_elasticsearch.enabled')) {
        service_handler(req => fuzzy(es, {
            index: INDEX.RECORD,
            query: req.query.q,
            type: [TYPE.COMPANIES, TYPE.USERS, TYPE.TAGS, TYPE.EVENTS],
            from: req.query.offset,
            size: min(MAX_RESULTS, req.query.limit),
            suggest: true,
        }), normalize)(req, res, <ErrorHandler>next);
    } else {
        let query_processor = x => x;
        let response_processor = results => ({results});
        let one_row = false;
        let defaults = {};

        req.query.q = `%${req.query.q}%`;

        let handler = query(conn, sql('search'), one_row, defaults,
            query_processor, response_processor);

        handler(req, res, <ErrorHandler>next);
    }
});

router.get('/tags', service_handler(req => fuzzy(es, {
    index: INDEX.RECORD,
    query: req.query.q,
    type: [TYPE.TAGS],
}), normalize));

router.get('/products', service_handler(req => fuzzy(es, {
    index: INDEX.RECORD,
    query: req.query.q,
    type: [TYPE.PRODUCTS],
}), normalize));

router.get('/companies', service_handler(req => fuzzy(es, {
    index: INDEX.RECORD,
    query: req.query.q,
    type: [TYPE.COMPANIES],
}), normalize));
