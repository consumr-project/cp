import { ServiceResponseV1 } from '../http';
import { Request, Response } from 'express';
import { Model, DestroyOptions, UpdateOptions, FindOptions } from 'sequelize';
import { BadRequestError, ERR_MSG_MISSING_FIELDS, ERR_MSG_INVALID_PARTS } from '../errors';

import { merge, includes, each, clone, map, filter as arr_filter, reduce, find,
    values, Dictionary } from 'lodash';

import * as q from 'q';
import { v4 } from 'node-uuid';

const ID_MAP: SDict = { id: 'id' };
const ID_FIELDS = [ 'id', 'updated_by', 'created_by' ];

type RequestHandler = (req: Request, res: Response, next?: Function) => void
type SDict = Dictionary<string>;
type Tag = { tag: string, val: any };

type Query = SDict & any;
type QueryOptions = UpdateOptions & DestroyOptions & FindOptions;

interface QueryResultsModelMeta  {
    count?: number;
    includes_me?: boolean;
}

// XXX remove this and just use `next`
function error(res: Response, err: Error) {
    res.status(500);
    res.json(<ServiceResponseV1<SDict>>{
        meta: {
            ok: false,
            message: err.message,
        },
        body: {}
    });
}

function generate_where(schema: SDict, params: SDict): SDict {
    return reduce(schema, (prop_remap, lookup: string, field: string) => {
        if (params[lookup]) {
            prop_remap[field] = params[lookup];
        }

        return prop_remap;
    }, {});
}

function build_query(prop_remap: SDict, params: SDict, extras: Object = {}): QueryOptions {
    var query = <QueryOptions>clone(extras);
    query.where = merge(generate_where(prop_remap, params), query.where);
    query.raw = true;
    return query;
}

function stamp_meta<V, H>(label: string, val: V): (holder: H) => H {
    return holder => {
        holder['@meta'] = holder['@meta'] || {};
        holder['@meta'][label] = val;
        return holder;
    };
}

function tag(name: string): (string) => Tag {
    return (val: string): Tag => {
        return {
            tag: name,
            val: val
        };
    };
}

function replace_with_uuid(val: string, field: string): Boolean {
    return val === '$UUID' && ID_FIELDS.indexOf(field) !== -1;
}

function populate_dates(body: Query): Query {
    var cbody = clone(body);

    if (!cbody.deleted_date) {
        cbody.deleted_date = null;
    }

    return cbody;
}

function populate_uuids(body: Query): Query {
    var id;

    return reduce(body, (prop_remap: SDict, val: string, field: string) => {
        if (replace_with_uuid(val, field)) {
            id = id || v4();
            val = id;
        }

        prop_remap[field] = val;
        return prop_remap;
    }, {});
}

function populate_extra_parameters(req: Request, extra_params: Object) {
    if (extra_params) {
        each(extra_params, function (field) {
            req.body[field] = req.params[field];
        });
    }
}

// XXX remove this and just use `next`
function error_handler(res: Response, action): any {
    return action.catch(err =>
        error(res, err));
}

function response_handler(res: Response, property?: string): any {
    var start_time = Date.now();

    return results => {
        var body = property ? results[property] : results,
            meta = {
                ok: true,
                error: false,
                elapsed_time: Date.now() - start_time
            };

        return res.json(<ServiceResponseV1<SDict | SDict[] | number>>{ meta, body });
    };
}

export function upsert(model: any, extra_params: string[] = []): RequestHandler {
    return (req, res) => {
        populate_extra_parameters(req, extra_params);
        error_handler(res, model.upsert(populate_uuids(populate_dates(req.body)))
            .then(response_handler(res)));
    };
}

/**
 * XXX instead of a callback this should pass the response down so that
 * handlers can just be appended.
 */
export function create(model: any, extra_params: string[] = [], cb?: (Model) => Promise<Model<any, any>>): RequestHandler {
    return (req, res) => {
        populate_extra_parameters(req, extra_params);
        error_handler(res, model.create(populate_uuids(populate_dates(req.body)))
            .then(model => cb ? cb(model) : model)
            .then(response_handler(res)));
    };
}

export function retrieve(model: any, prop_remap: SDict = ID_MAP): RequestHandler {
    var find: string;

    return (req, res) => {
        // GET model/:id
        // GET model/:parent_id/sub_model
        // GET model/:parent_id/sub_model/:id
        if (req.params.id || prop_remap) {
            find = req.params.id ? 'findOne' : 'findAll';
            error_handler(res, model[find](build_query(prop_remap, req.params, {
                paranoid: !req.params.id,
                order: ['created_date']
            })).then(response_handler(res)));
        } else {
            error(res, new Error('search not implemented'));
        }
    };
}

export function update(model: any): RequestHandler {
    return (req, res) => error_handler(res, model.update(
        populate_uuids(populate_dates(req.body)),
        build_query(ID_MAP, req.params)
    ).then(response_handler(res)));
}

/**
 * NOTE this will always do a soft-delete unless "purge=true" is passed as a
 * query paramter along with a valid "purge_key" value. this "purge_key" is
 * retrieved from the CP_PURGE_KEY env var.
 */
export function del(model: any, prop_remap: SDict = ID_MAP): RequestHandler {
    return (req, res, next) => {
        var deleted_by = req.user.id,
            where = { deleted_date: null },
            force = req.query.purge === 'true' &&
                req.query.purge_key === process.env.CP_PURGE_KEY &&
                process.env.CP_PURGE_KEY;

        // mismatching prop_remap to req.* is resulting in `delete from X`
        // queries
        for (var prop in prop_remap) {
            if (prop_remap.hasOwnProperty(prop) && !req.params[prop_remap[prop]]) {
                next(new BadRequestError(ERR_MSG_MISSING_FIELDS(values<string>(prop_remap))));
                return;
            }
        }

        error_handler(res, (<any>model).sequelize.transaction(transaction =>
            model.update({ deleted_by }, build_query(prop_remap, req.params,
                { transaction, where })).then(() =>
                model.destroy(build_query(prop_remap, req.params,
                    { transaction, force }))))).then(response_handler(res));
    };
}

export function parts(model: any, prop_remap, parts_def?): RequestHandler {
    if (!parts_def) {
        parts_def = prop_remap;
        prop_remap = {id: 'id'};
    }

    return (req, res, next) => {
        var parts_wanted = arr_filter((req.query.parts || '').split(',')),
            expand_wanted = arr_filter((req.query.expand || '').split(',')),
            bad_parts = [],
            queries = [];

        // check for invalid parts first
        each(parts_wanted, (part: string) => {
            if (!(part in parts_def)) {
                bad_parts.push(part);
            }
        });

        if (bad_parts.length) {
            next(new BadRequestError(ERR_MSG_INVALID_PARTS(bad_parts)));
            return;
        }

        // mian
        queries.push(model.findOne(build_query(prop_remap, req.params, {
            paranoid: false
        })).then(tag('main')));

        // parts
        each(parts_wanted, (part: string) => {
            var query = null,
                model = parts_def[part][0],
                prop_remap = parts_def[part][1],
                meta = parts_def[part][2] || {};

            if (meta.expand && includes(expand_wanted, part)) {
                query = model.findAll(build_query(prop_remap, req.params))
                    .then(results => {
                        var model = meta.expand[0],
                            remap = meta.expand[1];

                        results = Array.isArray(results) ? results : [results];

                        return q.all(map(results, val =>
                            model.findOne(build_query(remap, <SDict>val))
                                .then(stamp_meta('relationship', val))))
                                    .then(tag(part));
                    });
            } else if (meta.instead) {
                query = new Promise((resolve, reject) => {
                    var instead: QueryResultsModelMeta = {},
                        user_id = req.user.id,
                        checks = [];

                    if (meta.instead.count) {
                        checks.push(new Promise((resolve, reject) => {
                            model.findAndCountAll(build_query(prop_remap, req.params))
                                .then(count => {
                                    instead.count = count.count;
                                    resolve();
                                });
                        }));
                    }

                    if (meta.instead.includes_me) {
                        checks.push(new Promise((resolve, reject) => {
                            if (!user_id) {
                                instead.includes_me = false;
                                resolve();
                            } else {
                                model.findOne(build_query(prop_remap, req.params, {
                                    where: { user_id }
                                })).then(row => {
                                    instead.includes_me = !!row;
                                    resolve();
                                });
                            }
                        }));
                    }

                    return Promise.all(checks).then(() => q.when({})
                        .then(stamp_meta('instead', instead))
                        .then(tag(part))
                        .then(resolve));
                });
            } else {
                query = model.findAll(build_query(prop_remap, req.params))
                    .then(tag(part));
            }

            queries.push(query);
        });

        // combine `main` and `parts` into a single response object
        error_handler(res, q.all(queries)
            .then(results => {
                response_handler(res)(reduce(parts_wanted, (body, part: string) => {
                    body[part] = (<Tag>(find(results, {tag: part}) || {})).val;
                    return body;
                }, (<Tag>find(results, {tag: 'main'})).val));
            })
        );
    };
}

export function all(model: any): RequestHandler {
    return (req, res) =>
        error_handler(res, model.findAll({})
            .then(response_handler(res)));
}
