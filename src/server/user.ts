import * as express from 'express';
import { get_user_gravatar_url } from '../user/avatar';
import { service_redirect } from '../utilities';
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

    return get_user_gravatar_url(query, req.query.size, req.query.rating);
}));
