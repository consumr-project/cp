'use strict';

var each = require('lodash/collection/each'),
    reduce = require('lodash/collection/reduce'),
    uuid = require('node-uuid');

/**
 * @param {Object} schema
 * @param {Object} params
 * @return {Object}
 */
function generateWhere(schema, params) {
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
function replaceWithUUID(val, field) {
    return val === '$UUID' && [
        'id',

        // for users
        'updated_by',
        'created_by',
    ].indexOf(field) !== -1;
}

/**
 * @param {http.Request} res
 */
function populateIds(req) {
    var id;

    each(req.body, function (val, field) {
        if (replaceWithUUID(val, field)) {
            if (!id) {
                id = uuid.v4();
            }


            req.body[field] = id;
        }
    });
}

/**
 * @param {http.Request} req
 * @param {Object} extra_params
 */
function populateExtraParameters(req, extra_params) {
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
function handleErrors(res, action) {
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
function handleResponse(res, property) {
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
        populateIds(req);
        populateExtraParameters(req, extra_params);
        handleErrors(res, model.create(req.body))
            .then(handleResponse(res, 'dataValues'));
    };
}

/**
 * @param {Sequelize.Model} model
 * @param {Object} [filter]
 * @return {Function(http.Request, http.Response)}
 */
function retrieve(model, filter) {
    return function (req, res, next) {
        if (req.params.id && !filter) {
            // GET model/id
            handleErrors(res, model.findById(req.params.id))
                .then(handleResponse(res));
        } else if (req.params.id && filter) {
            // GET model/id/sub_model/sub_id
            handleErrors(res, model.findOne(generateWhere(filter, req.params)))
                .then(handleResponse(res));
        } else if (filter) {
            // GET model/id/sub_model
            handleErrors(res, model.findAll(generateWhere(filter, req.params)))
                .then(handleResponse(res));
        } else {
            // GET model?search
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
 * @return {Function(http.Request, http.Response)}
 */
function del(model) {
    return function (req, res, next) {
        handleErrors(res, model.destroy({ where: { id: req.params.id } }))
            .then(handleResponse(res));
    };
}

module.exports = {
    create: create,
    retrieve: retrieve,
    update: update,
    delete: del
};
