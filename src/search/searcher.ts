import { ServiceResponseV1 } from '../http';
import { Client as Elasticsearch, Results, Hit, Suggestion } from 'elasticsearch';
import { head, map, omit } from 'lodash';
import { option } from '../utilities';
import * as config from 'acm';

const SUGGESTION_LABEL = 'query';
export const IDX_RECORD = 'record';

export enum INDEX {
    RECORD = <any>'record',
}

export enum TYPE {
    COMPANIES = <any>'companies',
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
            suggestions: option(head(res.suggest[SUGGESTION_LABEL]))
                .get_or_else({ options: [] }).options,
        },
    };
}

export function fuzzy(es: Elasticsearch, query: Query): Promise<Results> {
    query.type = query.type || [];

    return es.search({
        from: query.from,
        index: query.index.toString(),
        size: query.size,
        type: query.type.join(','),
        body: {
            query: {
                bool: {
                    minimum_should_match: 1,
                    should: [
                        {
                            multi_match: {
                                fuzziness: config('elasticsearch.fuzziness'),
                                query: query.query,
                                fields: ['_all'],
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
            },

            suggest: {
                [SUGGESTION_LABEL]: {
                    text: query.query,
                    term: {
                        min_word_length: config('elasticsearch.suggest_size'),
                        size: config('elasticsearch.suggest_min_word_length'),
                        field: '_all',
                    }
                }
            },
        }
    });
}
