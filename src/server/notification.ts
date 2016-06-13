import * as express from 'express';

import { service_handler } from '../utilities';
import { ServiceUnavailableError, UnauthorizedError } from '../errors';

import Message, { CATEGORY, NOTIFICATION, OTYPE } from '../notification/message';
import { save, find, purge, update, purge_signature } from '../notification/collection';
import connect from '../service/mongo';
import config = require('acm');

export var app = express();

connect(config('mongo.collections.notifications'), (err, coll) => {
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

    app.put('/viewed', service_handler(req =>
        update(coll, req.body.ids, { $set: { viewed: true } })));

    app.post('/follow', service_handler(req => {
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.FOLLOWED, req.body.id, {
            id: req.user.id,
            otype: OTYPE.USER,
            name: req.user.name,
        });

        return save(coll, msg).then(ack => msg);
    }));

    app.delete('/follow/:id', service_handler(req => {
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.FOLLOWED, req.params.id, {
            id: req.user.id,
            otype: OTYPE.USER,
            name: req.user.name,
        });

        return purge_signature(coll, msg.signature);
    }));
});
