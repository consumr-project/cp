import { ServiceResponseV1 } from '../http';
import { head, map, omit } from 'lodash';
import { option } from '../utilities';
import { logger } from '../log';
import * as config from 'acm';

import { Client as Elasticsearch, Results, Hit, Suggestion,
    QueryBody } from 'elasticsearch';

const log = logger(__filename);

const ALL = '_all';
const SUGGESTION_LABEL = 'query';
export const IDX_RECORD = 'record';

export enum INDEX {
    RECORD = <any>'record',
}

export enum TYPE {
    COMPANIES = <any>'companies',
    PRODUCTS = <any>'products',
    TAGS = <any>'tags',
    USERS = <any>'users',
}

export interface SearchResults {
    results: Result[];
    suggestions: Suggestion[];
}

interface Query {
    from?: number;
    index: INDEX;
    query: string;
    size?: number;
    type?: TYPE[];
    suggest?: boolean;
}

interface Result {
    id: string;
    index: string;
    type: string;
    score: number;
    name: string;
    summary?: string;
    source: any;
}

function hit_to_result(hit: Hit): Result {
    return {
        id: hit._id,
        index: hit._index,
        type: hit._type,
        score: hit._score,
        name: hit._source.__label,
        summary: hit._source.summary || '',
        source: omit(hit._source, ['__label', 'summary']),
    };
}

export function normalize(res: Results): ServiceResponseV1<SearchResults> {
    return {
        meta: {
            ok: true,
            took: res.took,
        },
        body: {
            results: map<Hit, Result>(res.hits.hits, hit_to_result),
            suggestions: !res.suggest ? [] :
                option(head(res.suggest[SUGGESTION_LABEL]))
                    .get_or_else({ options: [] }).options,
        },
    };
}

export function fuzzy(es: Elasticsearch, query: Query): Promise<Results> {
    return search(es, query, {
        bool: {
            minimum_should_match: 1,
            should: [
                {
                    multi_match: {
                        fuzziness: config('elasticsearch.fuzziness'),
                        query: query.query,
                        fields: [ALL],
                    }
                },

                {
                    prefix: {
                        __label: {
                            value: query.query,
                            boost: config('elasticsearch.prefix_boost'),
                        }
                    }
                },

                {
                    fuzzy: {
                        __label: {
                            value: query.query,
                            fuzziness: config('elasticsearch.fuzziness'),
                            prefix_length: config('elasticsearch.prefix_length'),
                        }
                    }
                }
            ],
        },
    });
}

export function search(
    es: Elasticsearch,
    query_req: Query,
    query: QueryBody
): Promise<Results> {
    var from = query_req.from;
    var size = query_req.size;

    var index = query_req.index.toString();
    var type = query_req.type ? query_req.type.join(',') : '';

    var suggest = {
        [SUGGESTION_LABEL]: {
            text: query_req.query,
            term: {
                min_word_length: config('elasticsearch.suggest_size'),
                size: config('elasticsearch.suggest_min_word_length'),
                field: ALL,
            }
        }
    };

    var body = query_req.suggest ?
        { query, suggest } :
        { query };

    log.info('searching index: %s, type: %s, query:', index, type, query);

    return es.search({
        index,
        type,
        from,
        size,
        body,
    });
}
