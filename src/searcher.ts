import {Request, Response} from 'express';
import {map} from 'lodash';
import {Client as Elasticsearch, Promise, Hit, Results} from 'elasticsearch';
import config = require('acm');

type SearchResults = Array<any>;
type SearchFunction = (Elasticsearch, Request) => Promise;

interface Query {
    from?: number;
    index: string;
    query: string;
    size?: number;
    type: string;
}

interface Result {
    id: string;
    index: string;
    score: number;
    source: any;
    type: string;
}

function get_meta(res: Results): CPSearchServiceResultMetadata {
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

function make_response(res: Results): CPServiceResponseV1<Result> {
    return {
        meta: get_meta(res),
        body: map(res.hits.hits, make_result),
    };
}

export function fuzzy(es: Elasticsearch, query: Query): Promise {
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

export function search(es: Elasticsearch, searcher: SearchFunction): CPServiceRequestHandler {
    return (req, res, next) =>
        searcher(es, req.query).then(body =>
            res.json(make_response(body)));
}
