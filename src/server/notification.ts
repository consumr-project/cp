import * as express from 'express';

import { service_handler } from '../utilities';
import { ServiceUnavailableError, UnauthorizedError } from '../errors';

import Message, { CATEGORY, NOTIFICATION, OTYPE } from '../notification/message';
import { save, find } from '../notification/collection';
import connect from '../service/mongo';

export var app = express();

connect((err, coll) => {
    if (err) {
        app.use((req, res, next) => {
            next(new ServiceUnavailableError());
        });

        return;
    }

    app.use((req, res, next) => {
        if (!req.user || !req.user.id) {
            next(new UnauthorizedError());
        } else {
            next();
        }
    });

    app.get('/', service_handler(req =>
        find(coll, req.user.id, CATEGORY.NOTIFICATION, [NOTIFICATION.FOLLOWED])));

    app.post('/follow', service_handler(req =>
        save(coll, new Message(CATEGORY.NOTIFICATION, NOTIFICATION.FOLLOWED, req.body.id, {
            id: req.user.id,
            otype: OTYPE.USER,
            name: req.user.name,
        }))));
});
