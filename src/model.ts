import * as permissions from './permissions';
import { Request, Response } from 'express';
import { User, Promise } from 'query-service';
import QueryService = require('query-service');

const User = QueryService.models.User;

export function as_guest(req: Request, res: Response, next: Function): void {
    req.user = req.user || { role: permissions.roles.GUEST };
    next();
}

export function is_logged_in(req: Request, res: Response, next: Function): void {
    next(req.user ? null : new Error('Login required'));
}

export function serialize(user: User, done: Function): void {
    done(null, user.id);
}

export function deserialize(user_id: string, done: Function): Promise {
    return User.findById(user_id)
        .then(done.bind(null, null))
        .catch(done);
}

export function js_update(req: Request, res: Response): void {
    res.send([
        '<script>',
        '   (function () {',
        '       var ev = opener.document.createEvent("Events");',
        '       ev.initEvent("cp:auth", true, false);',
        '       opener.document.dispatchEvent(ev);',
        '       window.close();',
        '   })();',
        '</script>'
    ].join(''));
};
