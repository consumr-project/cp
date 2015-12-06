'use strict';

var each = require('lodash/collection/each'),
    uuid = require('node-uuid');

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
 * @return {Function(http.Request, http.Response)}
 */
function create(model) {
    return function (req, res) {
        populateIds(req);
        handleErrors(res, model.create(req.body))
            .then(handleResponse(res, 'dataValues'));
    };
}

/**
 * @param {Sequelize.Model} model
 * @return {Function(http.Request, http.Response)}
 */
function retrieve(model) {
    return function (req, res) {
        if (req.params.id) {
            handleErrors(res, model.findById(req.params.id))
                .then(handleResponse(res));
        }
    };
}

/**
 * @param {Sequelize.Model} model
 * @return {Function(http.Request, http.Response)}
 */
function update(model) {
    return function (req, res) {
    };
}

/**
 * @param {Sequelize.Model} model
 * @return {Function(http.Request, http.Response)}
 */
function del(model) {
    return function (req, res) {
    };
}

module.exports = {
    create: create,
    retrieve: retrieve,
    update: update,
    del: del
};
