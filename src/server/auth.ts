import * as debug from 'debug';
import * as express from 'express';
import * as passport from 'passport';
import config = require('acm');

import { Request, Response } from 'express';
import { User, Promise } from 'query-service';
import QueryService = require('query-service');

import * as permissions from '../service/auth/permissions';
import linkedin_auth from '../service/auth/linkedin';
import apikey_auth from '../service/auth/apikey';

const UserModel = QueryService.models.User;

export var app = express();
export { passport };

var log = debug('service:auth');
var linkedin = linkedin_auth();
var apikey = apikey_auth();

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);
passport.use(linkedin.strategy);
passport.use(apikey.strategy);

app.get('/user', (req, res) => res.json(req.user || {}));
app.get('/logout', (req, res, next) => { req.logout(); next(); }, js_update_client_auth);
app.get('/linkedin', linkedin.pre_base, linkedin.login);
app.get('/linkedin/callback', linkedin.callback, js_update_client_auth);

if (process.env.DEBUG && process.env.CP_ALLOW_APIKEY_AUTH) {
    app.post('/key', apikey.login, (req, res) => res.json(req.user || {}));
}

function serialize(user: User, done: Function): void {
    done(null, user.id);
}

function deserialize(user_id: string, done: Function): Promise {
    return UserModel.findById(user_id)
        .then(done.bind(null, null))
        .catch(done);
}

function js_update_client_auth(req: Request, res: Response): void {
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

export function is_logged_in(req: Request, res: Response, next: Function): void {
    next(req.user ? null : new Error('Login required'));
}

export function as_guest(req: Request, res: Response, next: Function): void {
    req.user = req.user || { role: permissions.roles.GUEST };
    next();
}
