import { ServiceRequestHandler } from '../device/http';
import { Configuration } from 'rbac-interface';

import { clone } from 'lodash';
import { make_enum } from '../utilities';
import { UnauthorizedError, ERR_MSG_RBAC_FAILURE } from '../errors';
import * as config from 'acm';

import Rbac = require('rbac');

const RULES = clone(config<Configuration>('rbac'));
const ROLES = make_enum(RULES.roles);


export const rbac = new Rbac(RULES);
export const roles = ROLES;


export function check(role: string, action: string, resource: string) {
    return new Promise<Boolean>((resolve, reject) => {
        rbac.can(role, action, resource, (err, can) => {
            if (err) {
                reject(err);
            } else if (!can) {
                reject(new UnauthorizedError(ERR_MSG_RBAC_FAILURE(role, action, resource)));
            } else {
                resolve(true);
            }
        });
    });
}

export function can(action: string, resource: string): ServiceRequestHandler {
    return (req, res, next) => {
        check(req.user.role, action, resource)
            .then(() => next(null))
            .catch(next);
    };
}
