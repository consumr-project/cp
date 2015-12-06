'use strict';

var each = require('lodash/collection/each'),
    reduce = require('lodash/collection/reduce'),
    uuid = require('node-uuid');

/**
 * @param {Object} schema
 * @param {Object} params
 * @return {Object}
 */
function generate_where(schema, params) {
    return { where: reduce(schema, function (filter, lookup, field) {
        if (params[lookup]) {
            filter[field] = params[lookup];
        }

        return filter;
    }, {}) };
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
        res.status(500);
        res.json(err);
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
function create(model, extra_params) {
    return function (req, res) {
        populate_extra_parameters(req, extra_params);
        error_handler(res, model.create(populate_uuids(req.body)))
            .then(response_handler(res, 'dataValues'));
    };
}

/**
 * @param {Sequelize.Model} model
 * @param {Object} [filter]
 * @return {Function(http.Request, http.Response)}
 */
function retrieve(model, filter) {
    return function (req, res, next) {
        // GET model/:id
        // GET model/:id/sub_model/:sub_id
        if (req.params.id) {
            error_handler(res, model.findOne(generate_where(filter, req.params)))
                .then(response_handler(res));
        // GET model/id/sub_model
        } else if (filter) {
            error_handler(res, model.findAll(generate_where(filter, req.params)))
                .then(response_handler(res));
        // GET model?search
        } else {
            next(new Error('search not implemented'));
        }
    };
}

/**
 * @param {Sequelize.Model} model
 * @return {Function(http.Request, http.Response)}
 */
function update(model) {
    return function (req, res, next) {
        next(new Error('update not implemented'));
    };
}

/**
 * @param {Sequelize.Model} model
 * @param {Object} [filter]
 * @return {Function(http.Request, http.Response)}
 */
function del(model, filter) {
    filter = filter || { id: 'id' };
    return function (req, res, next) {
        error_handler(res, model.destroy(generate_where(filter, req.params))
            .then(response_handler(res)));
    };
}

module.exports = {
    create: create,
    retrieve: retrieve,
    update: update,
    delete: del
};
