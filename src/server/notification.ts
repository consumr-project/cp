import * as express from 'express';

import { service_handler } from '../utilities';
import { ServiceUnavailableError, UnauthorizedError } from '../errors';

import Message, { CATEGORY, NOTIFICATION, OTYPE } from '../notification/message';
import { save, find, purge } from '../notification/collection';
import connect from '../service/mongo';

export var app = express();

connect((err, coll) => {
    app.use((req, res, next) => {
        if (!req.user || !req.user.id) {
            next(new UnauthorizedError());
        } else {
            next();
        }
    });

    app.use((req, res, next) => {
        if (err) {
            next(new ServiceUnavailableError());
        } else {
            next();
        }
    });

    app.get('/', service_handler(req =>
        find(coll, req.user.id, CATEGORY.NOTIFICATION, [NOTIFICATION.FOLLOWED])));

    app.delete('/:id', service_handler(req =>
        purge(coll, req.params.id)));

    app.post('/follow', service_handler(req =>
        save(coll, new Message(CATEGORY.NOTIFICATION, NOTIFICATION.FOLLOWED, req.body.id, {
            id: req.user.id,
            otype: OTYPE.USER,
            name: req.user.name,
        }))));
});
