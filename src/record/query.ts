import { ServiceRequestHandler } from 'cp';
import { Sequelize } from 'sequelize';

import { BadRequestError, ERR_MSG_MISSING_FIELDS } from '../errors';
import { service_response, pass } from '../utilities';
import { readFileSync as read } from 'fs';
import { template } from 'lodash';
import { head, merge, uniq, difference, map } from 'lodash';

const PARAMS = /[^:]:\w+/g;
const CLEAN_PARAM = /\W+/;

type MergeFields = any;
type TemplateFunction = (fields: MergeFields) => string;

function get_params(sql: string): string[] {
    return map(uniq(sql.match(PARAMS) || []), field =>
        field.replace(CLEAN_PARAM, ''));
}

function check_params(params: string[], replacements: {}): void {
    if (difference(params, Object.keys(replacements)).length) {
        throw new BadRequestError(ERR_MSG_MISSING_FIELDS(params));
    }
}

export function str(sql): TemplateFunction {
    return template(sql);
}

export function sql(name): TemplateFunction {
    var buff = read(`${__dirname}/../../src/queries/${name}.sql`);
    return str(buff.toString());
}

export function exec(
    conn: Sequelize,
    sql: TemplateFunction,
    auth: MergeFields = { user: { id: null } },
    params: MergeFields = {},
    defaults: MergeFields = {},
    one_row: boolean = false,
    processor: (value: Object) => Object = pass
) {
    return new Promise<Object | Object[]>((resolve, reject) => {
        var replacements, merged_sql, required_params;

        replacements = merge(params, defaults);
        merged_sql = sql({ auth, query: replacements });
        required_params = get_params(merged_sql);

        try {
            check_params(required_params, replacements);
            conn.query(merged_sql, { replacements })
                .then(one_row ? head : pass)
                .then(head)
                .then(processor)
                .then(resolve)
                .catch(reject);
        } catch (err) {
            reject(err);
        }
    });
}

export function query(
    conn: Sequelize,
    sql: TemplateFunction,
    one_row: boolean = false,
    defaults: MergeFields = {},
    processor?
): ServiceRequestHandler {
    return (req, res, next) => {
        exec(conn, sql, { user: req.user }, merge(req.query, req.params), defaults, one_row, processor)
            .then(service_response)
            .then(response => res.json(response))
            .catch(next);
    };
}
