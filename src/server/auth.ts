import { Request, Response } from 'express';
import { User as UserMessage } from 'cp/record';

import * as express from 'express';
import * as passport from 'passport';
import { User, Token } from '../service/models';
import { can, roles } from '../auth/permissions';
import linkedin_auth from '../auth/linkedin';
import apikey_auth from '../auth/apikey';
import { Day } from '../lang';
import { Manager } from '../auth/token';
import { service_handler } from '../service/http';

export var app = express();
export { passport };

const token = new Manager(Token);
const linkedin = linkedin_auth();
const apikey = apikey_auth();

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);
passport.use(linkedin.strategy);
passport.use(apikey.strategy);

app.get('/user', (req, res) => res.json(req.user || {}));
app.get('/logout', (req, res, next) => { req.logout(); next(); }, js_update_client_auth);

app.get('/linkedin', (req, res, next) => {
}, linkedin.pre_base, linkedin.login);
app.get('/linkedin/callback', linkedin.callback, js_update_client_auth);

app.post('/token',
    can('create', 'token'),
    service_handler(req => token.generate(
        new Date(req.body.expiration_date || Date.now() + Day * 30),
        req.body.reason,
        req.user
    )));

if (process.env.CP_ALLOW_APIKEY_AUTH) {
    app.post('/key', apikey.login, (req, res) => res.json(req.user || {}));
}

function serialize(user: UserMessage, done: Function): void {
    done(null, user.id);
}

function deserialize(user_id: string, done: (err: any) => any): Promise<UserMessage> {
    return User.findById(user_id)
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

export function as_guest(req: Request, res: Response, next: Function): void {
    req.user = req.user || { role: roles.GUEST };
    next();
}
