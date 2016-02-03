import {Request, Response} from 'express';
import {Sequelize} from 'sequelize';
import {Model, QueryResult} from 'query-service';
import * as Promise from 'bluebird';

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

function handle_error(next: Function, action: Promise<QueryResult>): Promise<QueryResult> {
    return action.catch(err => {
        console.error(err);
        next(err);
    });
}

export function query(conn: Sequelize, sql: string): CPServiceRequestHandler {
    return (req, res, next) =>
        track_metrics(handle_error(next, conn.query(sql, {
            replacements: req.query
        }))).then(response => res.json(response));
}
