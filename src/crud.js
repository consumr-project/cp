'use strict';

var each = require('lodash/collection/each'),
    clone = require('lodash/lang/clone'),
    pluck = require('lodash/collection/pluck'),
    reduce = require('lodash/collection/reduce'),
    find = require('lodash/collection/find'),
    uuid = require('node-uuid'),
    q = require('q');

/**
 * @param {http.Response} res
 * @param {Error} err
 */
function error(res, err) {
    res.status(500);
    res.json({
        ok: false,
        error: true,
        error_msg: err.message
    });
}

/**
 * @param {Object} schema
 * @param {Object} params
 * @return {Object}
 */
function generate_where(schema, params) {
    return reduce(schema, function (filter, lookup, field) {
        if (params[lookup]) {
            filter[field] = params[lookup];
        }

        return filter;
    }, {});
}

/**
 * @param {Object} schema
 * @param {Object} params
 * @return {Object}
 */
function where(filter, params) {
    return {
        where: generate_where(filter, params)
    };
}

/**
 * @param {String} name
 * @return {Function<*>}
 */
function tag(name) {
    return function (val) {
        return {
            tag: name,
            val: val
        };
    };
}

/**
 * @param {String} val
 * @param {String} field
 * @return {Boolean}
 */
function replace_with_uuid(val, field) {
    return val === '$UUID' && [
        'id',

        // for users
        'updated_by',
        'created_by',
    ].indexOf(field) !== -1;
}

/**
 * @param {Object} body
 * @return {Object}
 */
function populate_dates(body) {
    var cbody = clone(body);

    if (!cbody.deleted_date) {
        cbody.deleted_date = null;
    }

    return cbody;
}

/**
 * @param {Object} body
 * @param {Object}
 */
function populate_uuids(body) {
    var id;

    return reduce(body, function (filter, val, field) {
        if (replace_with_uuid(val, field)) {
            id = id || uuid.v4();
            val = id;
        }

        filter[field] = val;
        return filter;
    }, {});
}

/**
 * @param {http.Request} req
 * @param {Object} extra_params
 */
function populate_extra_parameters(req, extra_params) {
    if (extra_params) {
        each(extra_params, function (field) {
            req.body[field] = req.params[field];
        });
    }
}

/**
 * @param {http.Response} res
 * @param {Promise} action
 * @return {Promise}
 */
function error_handler(res, action) {
    return action.catch(function (err) {
        error(res, err);
    });
}

/**
 * @param {http.Response} res
 * @param {String} [property]
 * @return {Function}
 */
function response_handler(res, property) {
    return function (results) {
        res.json(property ? results[property] : results);
    };
}

/**
 * @param {Sequelize.Model} model
 * @param {Object} [extra_params]
 * @return {Function(http.Request, http.Response)}
 */
function upsert(model, extra_params) {
    return function (req, res) {
        populate_extra_parameters(req, extra_params);
        error_handler(res, model.upsert(populate_uuids(populate_dates(req.body))))
            .then(response_handler(res));
    };
}

/**
 * @param {Sequelize.Model} model
 * @param {Object} [extra_params]
 * @return {Function(http.Request, http.Response)}
 */
function create(model, extra_params) {
    return function (req, res) {
        populate_extra_parameters(req, extra_params);
        error_handler(res, model.create(populate_uuids(populate_dates(req.body))))
            .then(response_handler(res));
    };
}

/**
 * @param {Sequelize.Model} model
 * @param {Object} [filter]
 * @return {Function(http.Request, http.Response)}
 */
function retrieve(model, filter) {
    var find;

    return function (req, res) {
        // GET model/:id
        // GET model/:parent_id/sub_model
        // GET model/:parent_id/sub_model/:id
        if (req.params.id || filter) {
            find = req.params.id ? 'findOne' : 'findAll';
            error_handler(res, model[find](where(filter, req.params)))
                .then(response_handler(res));
        } else {
            error(res, new Error('search not implemented'));
        }
    };
}

/**
 * @param {Sequelize.Model} model
 * @return {Function(http.Request, http.Response)}
 */
function update(model) {
    return function (req, res) {
        error(res, new Error('update not implemented'));
    };
}

/**
 * @param {Sequelize.Model} model
 * @param {Object} [filter]
 * @return {Function(http.Request, http.Response)}
 */
function del(model, filter) {
    filter = filter || { id: 'id' };
    return function (req, res) {
        error_handler(res, model.destroy(where(filter, req.params))
            .then(response_handler(res)));
    };
}

/**
 * @param {Sequelize.Model} model
 * @param {String} field
 * @return {Function(http.Request, http.Response)}
 */
function like(model, field) {
    var filter = { where: {} };
    filter.where[field] = {};

    return function (req, res) {
        filter.where[field].$iLike = ['%', req.query.q, '%'].join('');
        error_handler(res, model.findAll(filter)).then(response_handler(res));
    };
}

/**
 * @param {Sequelize.Model} model
 * @param {Object} [filter]
 * @param {Object} parts_def
 * @return {Function(http.Request, http.Response)}
 */
function parts(model, filter, parts_def) {
    if (!parts_def) {
        parts_def = filter;
        filter = {id: 'id'};
    }

    return function (req, res) {
        var parts_wanted = (req.query.parts || '').split(','),
            bad_parts = [],
            queries = [];

        // check for invalid parts first
        each(parts_wanted, function (part) {
            if (!(part in parts_def)) {
                bad_parts.push(part);
            }
        });

        if (bad_parts.length) {
            error(res, new Error('Invalid part(s): ' + bad_parts.join(', ')));
            return;
        }

        // mian
        queries.push(model.findOne(where(filter, req.params)).then(tag('main')));

        // parts
        each(parts_wanted, function (part) {
            var model = parts_def[part][0],
                filter = parts_def[part][1];

            queries.push(model.findAll(where(filter, req.params)).then(tag(part)));
        });

        error_handler(res, q.all(queries))
            .then(function (results) {
                response_handler(res)(reduce(parts_wanted, function (body, part) {
                    body[part] = pluck(find(results, {tag: part}).val, 'dataValues');
                    return body;
                }, find(results, {tag: 'main'}).val.dataValues));
            });
    };
}

module.exports = {
    create: create,
    delete: del,
    like: like,
    parts: parts,
    retrieve: retrieve,
    update: update,
    upsert: upsert,
};
