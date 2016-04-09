import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { Model, QueryResult } from 'query-service';
import { uniq, difference, map } from 'lodash';
import * as Promise from 'bluebird';

const PARAMS = /:\w+/g;

function get_meta(start: number, results: any[]): CPSearchServiceResultMetadata {
    return {
        timed_out: false,
        took: Date.now() - start,
        total: results.length
    };
}

function track_metrics(action: Promise<QueryResult>): Promise<CPServiceResponseV1<Model[]>> {
    var start = Date.now();

    return action.then(res => {
        return {
            meta: get_meta(start, res[0]),
            body: res[0],
        };
    });
}

function track_error(next: Function, action: Promise<QueryResult>): Promise<QueryResult> {
    return action.catch(err =>
        handle_error(next, err));
}

function handle_error(next: Function, err: Error): void {
    console.error(err);
    next(err);
}

function get_params(sql: String): String[] {
    return map(uniq(sql.match(PARAMS) || []), field =>
        field.substr(1));
}

function check_params(params: String[], replacements: {}): void {
    if (difference(params, Object.keys(replacements)).length) {
        throw new Error(`Required params: ${params.join(', ')}`);
    }
}

export function query(conn: Sequelize, sql: string): CPServiceRequestHandler {
    var params = get_params(sql);

    return (req, res, next) => {
        var replacements = req.query,
            query;

        try {
            check_params(params, replacements);
            query = conn.query(sql, { replacements });
            track_metrics(track_error(next, query))
                .then(response => res.json(response));
        } catch (err) {
            handle_error(next, err);
        }
    };
}
