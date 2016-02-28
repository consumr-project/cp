import { Request, Response } from 'express';
import { Sequelize, Model, DestroyOptions, UpdateOptions, FindOptions } from 'sequelize';
import { merge, includes, each, clone, map, filter as arr_filter, reduce, find, Dictionary } from 'lodash';
import * as q from 'q';

const uuid = require('node-uuid');
const ID_MAP: SDict = { id: 'id' };
const ID_FIELDS = [ 'id', 'updated_by', 'created_by' ];

type RequestHandler = (req: Request, res: Response) => void
type SDict = Dictionary<string>;
type Tag = { tag: string, val: any };

type Query = SDict & any;
type QueryOptions = UpdateOptions & DestroyOptions & FindOptions;

function error(res: Response, err: Error) {
    res.status(500);
    res.json(<CPServiceResponseV1<SDict>>{
        meta: {
            ok: false,
            error: true,
            error_msg: err.message
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
            id = id || uuid.v4();
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

        return res.json(<CPServiceResponseV1<SDict | SDict[] | number>>{ meta, body });
    };
}

export function upsert(model: Model<any, any>, extra_params: string[] = []): RequestHandler {
    return (req, res) => {
        populate_extra_parameters(req, extra_params);
        error_handler(res, model.upsert(populate_uuids(populate_dates(req.body)))
            .then(response_handler(res)));
    };
}

export function create(model: Model<any, any>, extra_params: string[] = []): RequestHandler {
    return (req, res) => {
        populate_extra_parameters(req, extra_params);
        error_handler(res, model.create(populate_uuids(populate_dates(req.body)))
            .then(response_handler(res)));
    };
}

export function retrieve(model: Model<any, any>, prop_remap: SDict = ID_MAP): RequestHandler {
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

export function update(model: Model<any, any>): RequestHandler {
    return (req, res) => error_handler(res, model.update(
        populate_uuids(populate_dates(req.body)),
        build_query(ID_MAP, req.params)
    ).then(response_handler(res)));
}

export function del(model: Model<any, any>, prop_remap: SDict = ID_MAP): RequestHandler {
    return (req, res) => {
        var deleted_by = req.user.id,
            where = { deleted_date: null },
            force = req.query.purge === 'true' &&
                req.query.purge_key === process.env.CP_PURGE_KEY &&
                process.env.CP_PURGE_KEY;

        error_handler(res, (<any>model).sequelize.transaction(transaction =>
            model.update({ deleted_by }, build_query(ID_MAP, req.params,
                { transaction, where })).then(() =>
                model.destroy(build_query(prop_remap, req.params,
                    { transaction, force }))))).then(response_handler(res));
    }
}

export function like(model: Model<any, any>, field): RequestHandler {
    var filter: FindOptions = { where: { [field]: {} } };

    return (req, res) => {
        filter.where[field].$iLike = `%${req.query.q}%`;
        error_handler(res, model.findAll(filter)
            .then(response_handler(res)));
    };
}

export function parts(model: Model<any, any>, prop_remap, parts_def?): RequestHandler {
    if (!parts_def) {
        parts_def = prop_remap;
        prop_remap = {id: 'id'};
    }

    return (req, res) => {
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
            error(res, new Error(`Invalid part(s): ${bad_parts.join(', ')}`));
            return;
        }

        // mian
        queries.push(model.findOne(build_query(prop_remap, req.params))
            .then(tag('main')));

        // parts
        each(parts_wanted, (part: string) => {
            var model = parts_def[part][0],
                prop_remap = parts_def[part][1],
                meta = parts_def[part][2];

            var query = model.findAll(build_query(prop_remap, req.params));

            if (meta && meta.expand && includes(expand_wanted, part)) {
                query = query.then(results => {
                    var model = meta.expand[0],
                        remap = meta.expand[1];

                    results = Array.isArray(results) ? results : [results];

                    return q.all(map(results, val =>
                        model.findOne(build_query(remap, <SDict>val))
                            .then(stamp_meta('relationship', val))))
                                .then(tag(part));
                });
            } else {
                query = query.then(tag(part));
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

export function all(model: Model<any, any>): RequestHandler {
    return (req, res) =>
        error_handler(res, model.findAll({})
            .then(response_handler(res)));
}
