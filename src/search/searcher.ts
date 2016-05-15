import { ServiceRequestHandler, SearchServiceResultMetadata,
    ServiceResponseV1 } from 'cp';

import { Searcher, Query, Result } from 'cp/search';
import { Client as Elasticsearch, Hit, Results } from 'elasticsearch';
import { Request, Response } from 'express';

import { map } from 'lodash';
import config = require('acm');

function get_meta(res: Results): SearchServiceResultMetadata {
    return {
        timed_out: res.timed_out,
        took: res.took,
        total: res.hits.total,
    };
}

function make_result(hit: Hit): Result {
    return {
        id: hit._id,
        index: hit._index,
        score: hit._score,
        type: hit._type,
        source: hit._source,
    };
}

function make_response(res: Results): ServiceResponseV1<Result> {
    return {
        meta: get_meta(res),
        body: map(res.hits.hits, make_result),
    };
}

export function fuzzy(es: Elasticsearch, query: Query): Promise<Results> {
    return es.search({
        from: query.from,
        index: query.index,
        size: query.size,
        type: query.type,
        body: {
            query: {
                fuzzy_like_this: {
                    fuzziness: config('elasticsearch.fuzziness'),
                    like_text: query.query,
                }
            }
        }
    });
}

export function search(es: Elasticsearch, searcher: Searcher): ServiceRequestHandler {
    return (req, res, next) =>
        searcher(es, req.query).then(body =>
            res.json(make_response(body)));
}
