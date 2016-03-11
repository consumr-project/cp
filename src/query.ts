import { Request, Response } from 'express';
import { Model as BaseModel, Sequelize } from 'sequelize';
import { merge, uniq, difference, map } from 'lodash';
import * as Promise from 'bluebird';

const PARAMS = /:\w+/g;

type RequestHandler = (req: Request, res: Response, next?: Function) => void
type QueryResults = Array<any>;
type Model = BaseModel<any, any>;

function track_metrics(action: Promise<QueryResults>): Promise<CPServiceResponseV1<Model[]>> {
    var start = Date.now();
    var meta = { ok: true };

    return action.then(res => {
        var body = res[0];
        return { meta, body };
    });
}

function track_error(next: Function, action: Promise<QueryResults>): Promise<QueryResults> {
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

export default function query(conn: Sequelize, sql: string): RequestHandler {
    var params = get_params(sql);

    return (req, res, next) => {
        var replacements = merge(req.query, req.params),
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
