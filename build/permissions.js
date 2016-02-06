'use strict';
var lodash_1 = require('lodash');
var RBAC = require('rbac');
var config = require('acm');
var RULES = lodash_1.clone(config('rbac'));
exports.rbac = new RBAC(RULES);
exports.roles = RULES.roles.reduce(make_enum, {});
function make_enum(store, val) {
    store[val.toUpperCase()] = val;
    return store;
}
function can(action, resource) {
    return function (req, res, next) {
        return exports.rbac.can(req.user.role, action, resource, function (err, can) {
            return err ? next(err) :
                next(!can && new Error("user." + req.user.role + " cannot " + action + " " + resource));
        });
    };
}
exports.can = can;
