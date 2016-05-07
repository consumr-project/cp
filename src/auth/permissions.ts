import { Configuration as RbacConfiguration } from 'rbac-interface';
import { clone } from 'lodash';

import { make_enum } from '../utilities';
import { UnauthorizedError } from '../errors';

import Rbac = require('rbac');
import config = require('acm');

const RULES = clone(config<RbacConfiguration>('rbac'));
const ROLES = make_enum(RULES.roles);


export const rbac = new Rbac(RULES);
export const roles = ROLES;


export function check(role: string, action: string, resource: string) {
    return new Promise<Boolean>((resolve, reject) => {
        rbac.can(role, action, resource, (err, can) => {
            if (err) {
                reject(err);
            } else if (!can) {
                reject(new UnauthorizedError(`user(${role}) cannot ${action} ${resource}`));
            } else {
                resolve(true);
            }
        });
    });
}

export function can(action: string, resource: string): CPServiceRequestHandler {
    return (req, res, next) => {
        check(req.user.role, action, resource)
            .then(() => next(null))
            .catch(next);
    };
}
