import { ServiceResponseV1 } from '../http';
import { Client as Elasticsearch, Results, Hit } from 'elasticsearch';
import { map, omit } from 'lodash';
import * as config from 'acm';

export const IDX_RECORD = 'record';

export enum INDEX {
    RECORD = <any>'record',
}

export enum TYPE {
    COMPANIES = <any>'companies',
    TAGS = <any>'tags',
    USERS = <any>'users',
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

export function normalize(res: Results): ServiceResponseV1<Result[]> {
    return {
        meta: {
            ok: true,
            took: res.took,
        },
        body: map<Hit, Result>(res.hits.hits, hit_to_result)
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
                multi_match: {
                    fuzziness: config('elasticsearch.fuzziness'),
                    query: query.query,
                    fields: ['_all'],
                }
            }
        }
    });
}
