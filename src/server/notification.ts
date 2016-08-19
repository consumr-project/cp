import * as express from 'express';
import * as config from 'acm';
import * as Schema from 'cp/record';
import models from '../service/models';

import { DeleteWriteOpResultObject } from 'mongodb';
import { has_all_fields, runtime_purge_allowed } from '../utilities';
import { service_handler } from '../service/http';
import { ServiceUnavailableError, UnauthorizedError, BadRequestError,
    InternalServerError, ERR_MSG_MISSING_FIELDS } from '../errors';

import Message, { CATEGORY, NOTIFICATION, OTYPE } from '../notification/message';
import { save, find, purge, update, purge_signature } from '../notification/collection';
import { head } from 'lodash';
import connect from '../service/mongo';

const Event = models.Event;
export var app = express();

connect(config('mongo.collections.notifications'), (err, coll) => {
    function get_event_and_act_upon_message(id: string, action: Function, processor: (ev: Schema.Event) => Message) {
        // XXX check this isn't our own event
        return new Promise<Message | DeleteWriteOpResultObject>((resolve, reject) =>
            Event.findById(id)
                .then((ev: Schema.Event) => {
                    var msg = processor(ev);
                    msg.sign();

                    action(coll, action === purge_signature ? msg.signature : msg)
                        .then(ack => resolve(msg))
                        .catch(err => reject(new InternalServerError(err.message)));
                })
                .catch(err => reject(new InternalServerError(err.message))));
    }

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
        find(coll, req.user.id, CATEGORY.NOTIFICATION, [
            NOTIFICATION.CONTRIBUTED,
            NOTIFICATION.FAVORITED,
            NOTIFICATION.FOLLOWED,
            NOTIFICATION.MODIFIED,
        ])));

    app.get('/:id', service_handler((req, res, next) => {
        return find(coll, req.user.id, CATEGORY.NOTIFICATION, [], { id: req.params.id })
            .then(head);
    }));

    app.delete('/:id', service_handler((req, res, next) => {
        if (runtime_purge_allowed(req)) {
            return purge(coll, req.params.id);
        } else {
            next(new UnauthorizedError());
        }
    }));

    app.put('/completed', service_handler(req =>
        update(coll, req.body.ids, { $set: { completed: true } })));

    app.put('/viewed', service_handler(req =>
        update(coll, req.body.ids, { $set: { viewed: true } })));

    app.post('/follow', service_handler((req, res, next) => {
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.FOLLOWED, req.body.id, {
            id: req.user.id,
            otype: OTYPE.USER,
            name: req.user.name,
        });

        if (!req.body.id) {
            next(new BadRequestError(ERR_MSG_MISSING_FIELDS(['id'])));
            return;
        }

        return save(coll, msg).then(ack => msg);
    }));

    app.delete('/follow/:id', service_handler(req => {
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.FOLLOWED, req.params.id, {
            id: req.user.id,
            otype: OTYPE.USER,
        });

        return purge_signature(coll, msg.signature);
    }));

    app.post('/favorite', service_handler((req, res, next) => {
        let fields = ['id', 'p_id', 'p_otype'];
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.FAVORITED, null, {
            id: req.user.id,
            otype: OTYPE.USER,
            name: req.user.name,

            obj_id: req.body.id,
            obj_otype: OTYPE.EVENT,
            obj_name: req.body.id,

            p_obj_id: req.body.p_id,
            p_obj_otype: req.body.p_otype,
            p_obj_name: '',
        });

        if (!has_all_fields(fields, req.body)) {
            next(new BadRequestError(ERR_MSG_MISSING_FIELDS(fields)));
            return;
        }

        return get_event_and_act_upon_message(req.body.id, save, ev => {
            msg.to = ev.created_by;
            msg.payload.obj_name = ev.title;
            return msg;
        });
    }));

    app.delete('/favorite/:id', service_handler(req => {
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.FAVORITED, null, {
            id: req.user.id,
            otype: OTYPE.USER,
            obj_id: req.params.id,
            obj_otype: OTYPE.EVENT,
        });

        return get_event_and_act_upon_message(req.params.id, purge_signature, ev => {
            msg.to = ev.created_by;
            return msg;
        });
    }));

    app.post('/contribute', service_handler((req, res, next) => {
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.CONTRIBUTED, null, {
            id: req.user.id,
            otype: OTYPE.USER,
            name: req.user.name,
            obj_id: req.body.id,
            obj_otype: OTYPE.EVENT,
            obj_name: req.body.id,
        });

        if (!req.body.id) {
            next(new BadRequestError(ERR_MSG_MISSING_FIELDS(['id'])));
            return;
        }

        return get_event_and_act_upon_message(req.body.id, save, ev => {
            msg.to = ev.created_by;
            msg.payload.obj_name = ev.title;
            return msg;
        });
    }));

    app.delete('/contribute/:id', service_handler(req => {
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.CONTRIBUTED, null, {
            id: req.user.id,
            otype: OTYPE.USER,
            obj_id: req.params.id,
            obj_otype: OTYPE.EVENT,
        });

        return get_event_and_act_upon_message(req.params.id, purge_signature, ev => {
            msg.to = ev.created_by;
            return msg;
        });
    }));

    app.post('/modify', service_handler((req, res, next) => {
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.MODIFIED, null, {
            id: req.user.id,
            otype: OTYPE.USER,
            name: req.user.name,
            obj_id: req.body.id,
            obj_otype: OTYPE.EVENT,
            obj_name: req.body.id,
        });

        if (!req.body.id) {
            next(new BadRequestError(ERR_MSG_MISSING_FIELDS(['id'])));
            return;
        }

        return get_event_and_act_upon_message(req.body.id, save, ev => {
            msg.to = ev.created_by;
            msg.payload.obj_name = ev.title;
            return msg;
        });
    }));

    app.delete('/modify/:id', service_handler(req => {
        let msg = new Message(CATEGORY.NOTIFICATION, NOTIFICATION.MODIFIED, null, {
            id: req.user.id,
            otype: OTYPE.USER,
            obj_id: req.params.id,
            obj_otype: OTYPE.EVENT,
        });

        return get_event_and_act_upon_message(req.params.id, purge_signature, ev => {
            msg.to = ev.created_by;
            return msg;
        });
    }));
});
