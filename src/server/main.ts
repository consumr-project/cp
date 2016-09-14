require('dotenv').config();

import { app as auth_endpoints } from './auth';
import { app as extract_endpoints } from './extract';
import { app as notification_endpoints } from './notification';
import { app as record_endpoints } from './record';
import { app as search_endpoints } from './search';
import { app as user_endpoints } from './user';
import { app as version_endpoints } from './version';

import { KEY_SESSION } from '../keys';
import { ServiceResponseV1 } from '../http';
import { HttpError } from '../errors';
import { normalize_i18n } from '../strings';
import * as auth_service from './auth';
import * as express from 'express';
import * as config from 'acm';

const index = require('serve-index');
const favicon = require('serve-favicon');
const body_parser = require('body-parser');
const cookie = require('cookie-parser');
const timeout = require('connect-timeout');
const session = require('express-session');
const compression = require('compression');
const swig = require('swig');
const debug = require('debug');

const log = debug('cp:server');
const app = express();

const SERVER_JIT_COMPRESSION = !!config('SERVER_JIT_COMPRESSION');
const SERVER_VIEW_CACHING = !!config('SERVER_VIEW_CACHING');
const CLIENT_DEBUG_INFO = !!config('CLIENT_DEBUG_INFO');

app.set('x-powered-by', false);
app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', `${__dirname}/../../assets/views`);
app.engine('html', swig.renderFile);

if (SERVER_JIT_COMPRESSION) {
    log('server jit compression');
    app.use(compression());
}

app.use('/build', express.static('build'));
app.use('/src/client', express.static('src/client'));
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
app.use(favicon(`${__dirname}/../../assets/images/favicon.png`));

if (CLIENT_DEBUG_INFO) {
    app.use('/app', index('app'));
    app.use('/assets', index('assets'));
}

if (SERVER_VIEW_CACHING) {
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

app.use(body_parser.json());
app.use(cookie(process.env.CP_COOKIE_KEY));
app.use(session({ secret: KEY_SESSION }));
app.use(auth_service.passport.initialize());
app.use(auth_service.passport.session());
app.use(auth_service.as_guest);
app.use('/service/auth', auth_endpoints);
app.use('/service/user', timeout('5s'), user_endpoints);
app.use('/service/search', timeout('5s'), search_endpoints);
app.use('/service/extract', timeout('5s'), extract_endpoints);
app.use('/service/notification', timeout('5s'), notification_endpoints);
app.use('/service/record', timeout('60s'), record_endpoints);
app.use('/version', version_endpoints);
app.use('/ping', (req, res) => res.json({ ok: true }));

// language cookie handler
app.use((req, res, next) => {
    res.cookie('lang', normalize_i18n(req.query.lang), {
        expires: new Date('2099-01-01') });

    next();
});

// default headers
app.use((req, res, next) => {
    res.header('X-Frame-Options', 'DENY');
    next();
});

// error handler
app.use((err: any, req, res, next) => {
    console.error('ERROR ==========================');
    console.error(err);
    console.error(err.stack);

    if (!res.headersSent) {
        if (err instanceof HttpError) {
            res.status(err.code);
        } else {
            res.status(500);
        }

        if (/^\/service\//.test(req.url)) {
            res.json(<ServiceResponseV1<void>>{
                meta: {
                    ok: false,
                    message: err.message,
                },
                body: {}
            });
        } else {
            res.render('index', {
                err,
                debugging: CLIENT_DEBUG_INFO,
                lang: normalize_i18n(req.query.lang),
            });
        }
    }
});

// view handler
app.get('*', (req, res) =>
    res.render('index', {
        debugging: CLIENT_DEBUG_INFO,
        lang: normalize_i18n(req.query.lang),
    }));

app.listen(config('port') || 3000);
log('listening for requests');
