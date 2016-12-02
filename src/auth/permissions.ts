import { ServiceRequestHandler } from '../http';
import { Configuration } from 'rbac-interface';

import { clone } from 'lodash';
import { UnauthorizedError, ERR_MSG_RBAC_FAILURE } from '../errors';
import * as config from 'acm';

import Rbac = require('rbac');

export enum Role {
    admin = <any>'admin',
    user = <any>'user',
    guest = <any>'guest',
}

export const rbac = new Rbac(clone(config<Configuration>('rbac')));

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

export const loggedin: ServiceRequestHandler = function (req, res, next) {
    if (!req.user || !req.user.id) {
        next(new UnauthorizedError());
    } else {
        next();
    }
};
