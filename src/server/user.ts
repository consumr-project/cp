import * as express from 'express';
import { url } from '../user/avatar';
import { service_redirect } from '../http';
import { BadRequestError, ERR_MSG_MISSING_FIELDS } from '../errors';

export var app = express();

app.get('/avatar', service_redirect((req, res, next) => {
    var query: any = {};

    if (req.query.email) {
        query.email = req.query.email;
    } else if (req.query.id) {
        query.id = req.query.id;
    } else {
        return new Promise<string>((resolve, reject) =>
            reject(new BadRequestError(ERR_MSG_MISSING_FIELDS(['email or id']))));
    }

    return url(query, req.query.size, req.query.rating);
}));
