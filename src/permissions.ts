import { clone } from 'lodash';

import RBAC = require('rbac');
import config = require('acm');

const RULES = clone(config('rbac'));

export const rbac = new RBAC(RULES);
export const roles = RULES.roles.reduce(make_enum, {});

function make_enum(store: Object, val: string): Object {
    store[val.toUpperCase()] = val;
    return store;
}

export function can(action: string, resource: string) {
    return (req, res, next) =>
        rbac.can(req.user.role, action, resource, (err, can) =>
            err ? next(err) :
                next(!can && new Error(`user.${req.user.role} cannot ${action} ${resource}`)));
}
