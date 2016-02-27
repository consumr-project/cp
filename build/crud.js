"use strict";
var lodash_1 = require('lodash');
var q = require('q');
var uuid = require('node-uuid');
var ID_MAP = { id: 'id' };
var ID_FIELDS = ['id', 'updated_by', 'created_by'];
function error(res, err) {
    res.status(500);
    res.json({
        ok: false,
        error: true,
        error_msg: err.message
    });
}
function generate_where(schema, params) {
    return lodash_1.reduce(schema, function (prop_remap, lookup, field) {
        if (params[lookup]) {
            prop_remap[field] = params[lookup];
        }
        return prop_remap;
    }, {});
}
function build_query(prop_remap, params, extras) {
    if (extras === void 0) { extras = {}; }
    var query = lodash_1.clone(extras);
    query.where = generate_where(prop_remap, params);
    query.raw = true;
    return query;
}
function stamp_meta(label, val) {
    return function (holder) {
        holder['@meta'] = holder['@meta'] || {};
        holder['@meta'][label] = val;
        return holder;
    };
}
function tag(name) {
    return function (val) {
        return {
            tag: name,
            val: val
        };
    };
}
function replace_with_uuid(val, field) {
    return val === '$UUID' && ID_FIELDS.indexOf(field) !== -1;
}
function populate_dates(body) {
    var cbody = lodash_1.clone(body);
    if (!cbody.deleted_date) {
        cbody.deleted_date = null;
    }
    return cbody;
}
function populate_uuids(body) {
    var id;
    return lodash_1.reduce(body, function (prop_remap, val, field) {
        if (replace_with_uuid(val, field)) {
            id = id || uuid.v4();
            val = id;
        }
        prop_remap[field] = val;
        return prop_remap;
    }, {});
}
function populate_extra_parameters(req, extra_params) {
    if (extra_params) {
        lodash_1.each(extra_params, function (field) {
            req.body[field] = req.params[field];
        });
    }
}
function error_handler(res, action) {
    return action.catch(function (err) {
        return error(res, err);
    });
}
function response_handler(res, property) {
    return function (results) {
        return res.json(property ? results[property] : results);
    };
}
function upsert(model, extra_params) {
    if (extra_params === void 0) { extra_params = []; }
    return function (req, res) {
        populate_extra_parameters(req, extra_params);
        error_handler(res, model.upsert(populate_uuids(populate_dates(req.body))))
            .then(response_handler(res));
    };
}
exports.upsert = upsert;
function create(model, extra_params) {
    if (extra_params === void 0) { extra_params = []; }
    return function (req, res) {
        populate_extra_parameters(req, extra_params);
        error_handler(res, model.create(populate_uuids(populate_dates(req.body))))
            .then(response_handler(res));
    };
}
exports.create = create;
function retrieve(model, prop_remap) {
    if (prop_remap === void 0) { prop_remap = ID_MAP; }
    var find;
    return function (req, res) {
        if (req.params.id || prop_remap) {
            find = req.params.id ? 'findOne' : 'findAll';
            error_handler(res, model[find](build_query(prop_remap, req.params, {
                order: ['created_date']
            }))).then(response_handler(res));
        }
        else {
            error(res, new Error('search not implemented'));
        }
    };
}
exports.retrieve = retrieve;
function update(model) {
    return function (req, res) { return error_handler(res, model.update(populate_uuids(populate_dates(req.body)), build_query(ID_MAP, req.params))).then(response_handler(res)); };
}
exports.update = update;
function del(model, prop_remap) {
    if (prop_remap === void 0) { prop_remap = ID_MAP; }
    return function (req, res) {
        return error_handler(res, model.destroy(build_query(prop_remap, req.params))
            .then(response_handler(res)));
    };
}
exports.del = del;
function like(model, field) {
    var filter = { where: (_a = {}, _a[field] = {}, _a) };
    return function (req, res) {
        filter.where[field].$iLike = "%" + req.query.q + "%";
        error_handler(res, model.findAll(filter))
            .then(response_handler(res));
    };
    var _a;
}
exports.like = like;
function parts(model, prop_remap, parts_def) {
    if (!parts_def) {
        parts_def = prop_remap;
        prop_remap = { id: 'id' };
    }
    return function (req, res) {
        var parts_wanted = lodash_1.filter((req.query.parts || '').split(',')), expand_wanted = lodash_1.filter((req.query.expand || '').split(',')), bad_parts = [], queries = [];
        lodash_1.each(parts_wanted, function (part) {
            if (!(part in parts_def)) {
                bad_parts.push(part);
            }
        });
        if (bad_parts.length) {
            error(res, new Error("Invalid part(s): " + bad_parts.join(', ')));
            return;
        }
        queries.push(model.findOne(build_query(prop_remap, req.params))
            .then(tag('main')));
        lodash_1.each(parts_wanted, function (part) {
            var model = parts_def[part][0], prop_remap = parts_def[part][1], meta = parts_def[part][2];
            var query = model.findAll(build_query(prop_remap, req.params));
            if (meta && meta.expand && lodash_1.includes(expand_wanted, part)) {
                query = query.then(function (results) {
                    var model = meta.expand[0], remap = meta.expand[1];
                    results = Array.isArray(results) ? results : [results];
                    return q.all(lodash_1.map(results, function (val) {
                        return model.findOne(build_query(remap, val))
                            .then(stamp_meta('relationship', val));
                    }))
                        .then(tag(part));
                });
            }
            else {
                query = query.then(tag(part));
            }
            queries.push(query);
        });
        error_handler(res, q.all(queries)
            .then(function (results) {
            response_handler(res)(lodash_1.reduce(parts_wanted, function (body, part) {
                body[part] = (lodash_1.find(results, { tag: part }) || {}).val;
                return body;
            }, lodash_1.find(results, { tag: 'main' }).val));
        }));
    };
}
exports.parts = parts;
function all(model) {
    return function (req, res) {
        return error_handler(res, model.findAll({}))
            .then(response_handler(res));
    };
}
exports.all = all;
