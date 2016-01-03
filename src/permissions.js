'use strict';

var RBAC = require('rbac'),
    config = require('acm'),
    format = require('util').format;

var rbac = new RBAC(config('rbac'));

/**
 * NOTE instead of:
 * var secure = require('rbac/controllers/express');
 * return secure.can(rbac, action, resource);
 *
 * @param {String} action
 * @param {String} resource
 * @return {Function}
 */
function can(action, resource) {
    return function (req, res, next) {
        rbac.can(req.user.role, action, resource, function (err, can) {
            if (!can) {
                next(new Error(format('user.%s cannot %s %s', req.user.role, action, resource)));
            } else {
                next(err);
            }
        });
    };
}

module.exports.rbac = rbac;
module.exports.can = can;
module.exports.roles = config('rbac').roles.reduce(function (roles, role) {
    roles[role.toUpperCase()] = role;
    return roles;
}, {});
