import * as express from 'express';

import { ServiceUnavailableError, UnauthorizedError } from '../errors';

import { CATEGORY, NOTIFICATION } from '../notification/message';
import { find } from '../notification/collection';
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

    app.get('/', (req, res, next) => {
        find(coll, req.user.id, CATEGORY.NOTIFICATION, [NOTIFICATION.FOLLOWED])
            .then(rows => res.json(rows));
    });
});
