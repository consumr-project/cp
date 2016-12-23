import { Router, Request, Response } from 'express';
import { UserMessage } from '../record/models/user';

import * as passport from 'passport';
import { update_user } from '../repository/user';
import { User, Token } from '../device/models';
import { Role, can, loggedin } from '../auth/permissions';
import linkedin_auth from '../auth/linkedin';
import { LOCKEDDOWN, InvalidBetaUserError } from '../auth/lockdown';
import apikey_auth from '../auth/apikey';
import { h, dispatch_event } from '../html';
import { Day } from '../lang';
import { Manager } from '../auth/token';
import { service_handler, service_response } from '../http';

import { decrypt } from '../crypto';
import { KEY_USER_EMAIL } from '../keys';

export const router = Router();
export { passport };

const token = new Manager(Token);
const linkedin = linkedin_auth();
const apikey = apikey_auth();

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);
passport.use(linkedin.strategy);
passport.use(apikey.strategy);

router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'private, max-age=0');
    next();
});

router.get('/user', (req, res) =>
    res.json(service_response(req.user || {})));

router.get('/user/email', loggedin, (req, res) =>
    res.json(service_response(decrypt(req.user.email, KEY_USER_EMAIL))));

router.put('/user/email', loggedin, service_handler(req =>
    update_user({ id: req.user.id }, { email: req.body.email })));

router.get('/logout', (req, res, next) => { req.logout(); next(); },
    js_update_client_auth);

router.get('/linkedin', linkedin.setup, linkedin.login);
router.get('/linkedin/callback', linkedin.callback, js_update_client_auth);
router.use((err: any, req, res, next) => {
    if (err instanceof InvalidBetaUserError && LOCKEDDOWN) {
        req.logout();
        js_update_client_auth_locked_down(req, res);
    } else {
        next(err);
    }
});

router.post('/token',
    can('create', 'token'),
    service_handler(req => token.generate(
        new Date(req.body.expiration_date || Date.now() + Day * 30),
        req.body.reason,
        req.user
    )));

if (process.env.CP_ALLOW_APIKEY_AUTH) {
    router.post('/key', apikey.login, (req, res) => res.json(req.user || {}));
}

function serialize(user: UserMessage, done: Function): void {
    done(null, user.id);
}

function deserialize(user_id: string, done: (err: any) => any): Promise<UserMessage> {
    return User.findById(user_id)
        .then(done.bind(null, null))
        .catch(done);
}

export function as_guest(req: Request, res: Response, next: Function): void {
    req.user = req.user || { role: Role.guest };
    next();
}

function js_update_client_auth(req: Request, res: Response): void {
    res.send(h('script', dispatch_event('cp:auth')));
};

function js_update_client_auth_locked_down(req: Request, res: Response): void {
    res.send(h('script', dispatch_event('cp:auth_locked_down')));
};
