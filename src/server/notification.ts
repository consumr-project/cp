import * as express from 'express';

import Message, { CATEGORY, NOTIFICATION } from '../notification/message';
import { save, find } from '../notification/collection';
import connect from '../service/mongo';

export var app = express();

connect((err, coll) => {
    if (err) {
        return;
    }

    app.get('/find', (req, res, next) => {
        find(coll, CATEGORY.NOTIFICATION, [NOTIFICATION.FOLLOWED])
            .then(rows => res.json(rows));
    });
});
