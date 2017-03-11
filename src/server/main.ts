require('dotenv').config();

import { router as auth_endpoints } from './auth';
import { router as extract_endpoints } from './extract';
import { router as notification_endpoints } from './notification';
import { router as record_endpoints } from './record';
import { router as search_endpoints } from './search';
import { router as user_endpoints } from './user';
import { router as version_endpoints } from './version';

import { KEY_SESSION } from '../keys';
import { hours } from '../utilities';
import { HttpError, RequestTimeoutError } from '../errors';
import { normalize_i18n } from '../strings';
import { OG, unfurl } from '../unfurling';
import { logger } from '../log';
import * as toes from '../toe';
import * as auth_service from './auth';
import * as express from 'express';
import { static as serve } from 'express';
import * as config from 'acm';

const index = require('serve-index');
const favicon = require('serve-favicon');
const body_parser = require('body-parser');
const cookie = require('cookie-parser');
const timeout = require('connect-timeout');
const session = require('express-session');
const LokiStore = require('connect-loki')(session);
const compression = require('compression');
const swig = require('swig');

const log = logger(__filename);
const app = express();

const SERVER_JIT_COMPRESSION = !!config('SERVER_JIT_COMPRESSION');
const SERVER_VIEW_CACHING = !!config('SERVER_VIEW_CACHING');
const SERVER_ROBOTS_TXT = !!config('server.robots.txt');
const CLIENT_DEBUG_INFO = !!config('CLIENT_DEBUG_INFO');

app.set('x-powered-by', false);
app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', `${__dirname}/../../assets/views`);
app.engine('html', swig.renderFile);

if (SERVER_JIT_COMPRESSION) {
    log.info('server jit compression');
    app.use(compression());
}

app.use((req, res, next) => {
    res.setHeader('Cache-Control', `public, max-age=${hours(2)}`);
    res.setHeader('X-Powered-By', '<3');
    next();
});

app.use('/manifest.json', serve('assets/resources/manifest.json'));
app.use('/build', serve('build'));
app.use('/src/client', serve('src/client'));
app.use('/assets', serve('assets'));
app.use('/node_modules', serve('node_modules'));
app.use(favicon(`${__dirname}/../../assets/images/favicon.png`));

if (SERVER_ROBOTS_TXT) {
    app.use('/robots.txt', serve('assets/resources/robots.txt'));
} else {
    app.use('/robots.txt', serve('assets/resources/nobots.txt'));
}

if (CLIENT_DEBUG_INFO) {
    app.use('/app', index('app'));
    app.use('/assets', index('assets'));
}

if (!SERVER_VIEW_CACHING) {
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

app.use(body_parser.json());
app.use(cookie(process.env.CP_COOKIE_KEY));

app.use(session({
    name: 'cp.session',
    secret: KEY_SESSION,
    saveUninitialized: false,
    resave: false,
    store: new LokiStore({
        path: `${__dirname}/../../build/session.db`
    }),
}));

app.use((req, res, next) => {
    if (!res.headersSent && req.sessionID) {
        toes.initialize(req.sessionID, (err, toe) => {
            res.header('X-CP-Toe', toe.toString());
            next();
        });
    } else {
        next();
    }
});

app.use((req, res, next) => {
    log.info('routing %s %s', req.method, req.url);
    next();
});

app.use(auth_service.passport.initialize());
app.use(auth_service.passport.session());
app.use(auth_service.as_guest);
app.use('/service/auth', auth_endpoints);
app.use('/service/user', timeout('20s'), user_endpoints);
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

    if (req.query.cp_theme) {
        res.cookie('cp_theme', req.query.cp_theme);
    }

    next();
});

// default headers
app.use((req, res, next) => {
    res.header('X-Frame-Options', 'DENY');
    next();
});

// error handler
app.use((err: any, req, res, next) => {
    log.error('catching request handler error', err);

    if (!res.headersSent) {
        if (err instanceof HttpError) {
            log.debug('sending back %s(%s)', err.name, err.code);
            res.status(err.code);
        } else if (err.code === 'ETIMEDOUT' || err.type === 'entity.too.large') {
            log.debug('sending back Request Timeout(408)');
            res.status(RequestTimeoutError.code);
        } else {
            res.status(500);
        }
    }

    res.render('index', {
        err,
        cp_url: config('cp_url'),
        debugging: CLIENT_DEBUG_INFO,
        lang: normalize_i18n(req.query.lang),
    });
});

// view handler
app.get('*', (req, res) => {
    unfurl(req.url)
        .then(unfurled => res.render('index', {
            unfurled,
            cp_url: config('cp_url'),
            debugging: CLIENT_DEBUG_INFO,
            lang: normalize_i18n(req.query.lang),
        })).catch(err => res.render('index', {
            unfurled: OG,
            cp_url: config('cp_url'),
            debugging: CLIENT_DEBUG_INFO,
            lang: normalize_i18n(req.query.lang),
        }));
});

log.debug('loading hooks');
import '../hooks/user_created';

app.listen(config('port') || 3000);
log.info('listening for requests');
