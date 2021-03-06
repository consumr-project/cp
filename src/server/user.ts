import { Router } from 'express';
import * as multer from 'multer';

import { ErrorHandler } from '../lang';
import { loggedin } from '../auth/permissions';
import { update_user } from '../repository/user';
import { upload, url, valid_image_type, SUPPORTED_MIMES } from '../user/avatar';
import { service_handler, service_redirect } from '../http';

import { UnprocessableEntityError, BadRequestError,
    ERR_MSG_MISSING_FIELDS, ERR_MSG_INVALID_ENTITY_TYPE } from '../errors';

export
const router = Router();
const storage = multer.memoryStorage();
const uploader = multer({ storage, fileFilter: filter });

function filter(req, file, cb) {
    if (!valid_image_type(file)) {
        cb(new UnprocessableEntityError(ERR_MSG_INVALID_ENTITY_TYPE(
            file.mimetype,
            SUPPORTED_MIMES
        )), false);
    } else {
        cb(null, true);
    }
}

router.get('/avatar', service_redirect((req, res, next) => {
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

router.post('/upload', loggedin);

router.post('/upload', (req, res, next) => {
    if (!req.body.data) {
        next();
        return;
    }

    service_handler(req =>
        upload(req.body.data)
            .then(avatar_url => update_user({
                id: req.user.id,
            }, { avatar_url }))
    )(req, res, <ErrorHandler>next);
});

router.post('/upload',
    uploader.single('file'),
    service_handler(req =>
        upload(req.file.buffer.toString('base64'))
            .then(avatar_url => update_user({
                id: req.user.id,
            }, { avatar_url }))
    )
);
