'use strict';

const PCKGE = require('../package.json');
const STAMP = require('../stamp.json');

/**
 * process.env.NEW_RELIC_NO_CONFIG_FILE = true;
 * require('newrelic');
 */
const express = require('express');
const index = require('serve-index');
const errors = require('errorhandler');
const favicon = require('serve-favicon');
const body_parser = require('body-parser');
const cookie = require('cookie-parser');
const timeout = require('connect-timeout');
const session = require('express-session');
const swig = require('swig');
const debug = require('debug');

const search_service = require('search-service');
const auth_service = require('auth-service');
const extract_service = require('extract-service');
const notification_service = require('notification-service');
const query_service = require('query-service');
const user_service = require('user-service');
const config = require('acm');

var log = debug('cp:server'),
    app = express(),
    debugging = !!config('debug');

app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', `${__dirname}/modules`);
app.engine('html', swig.renderFile);

app.use('/build', express.static('build'));
app.use('/app', express.static('app'));
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
app.use(favicon(`${__dirname}/../assets/images/favicon.png`));

if (debugging) {
    app.use('/app', index('app'));
    app.use('/assets', index('assets'));
    app.use(errors());
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

app.use(body_parser.json());
app.use(cookie(config('session.secret')));
app.use(session({ secret: config('session.secret') }));

app.use(auth_service.passport.initialize());
app.use(auth_service.passport.session());
app.use(auth_service.as_guest);
app.use('/service/auth', timeout('10s'), auth_service);

app.use('/service/user', timeout('5s'), user_service);

app.use('/service/notification', auth_service.is_logged_in);
app.use('/service/notification', timeout('5s'), notification_service);

app.use('/service/search', timeout('5s'), search_service);
app.use('/service/extract', timeout('5s'), extract_service);

app.delete('/service/query/*', auth_service.is_logged_in);
app.patch('/service/query/*', auth_service.is_logged_in);
app.post('/service/query/*', auth_service.is_logged_in);
app.put('/service/query/*', auth_service.is_logged_in);
app.use('/service/query', timeout('60s'), query_service);

app.get('/version', (req, res) => {
    res.json({
        date: STAMP.date,
        head: STAMP.head,
        branch: STAMP.branch,
        version: PCKGE.version,
        services: {
            auth: PCKGE.dependencies['auth-service'],
            extract: PCKGE.dependencies['extract-service'],
            notification: PCKGE.dependencies['notification-service'],
            query: PCKGE.dependencies['query-service'],
            search: PCKGE.dependencies['search-service'],
            user: PCKGE.dependencies['user-service'],
        }
    });
});

app.use((req, res, next) => {
    res.cookie('lang', req.query.lang || req.query.lang || 'en', {
        expires: new Date('2099-01-01') });

    next();
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.render('base/index', { debugging, err,
        lang: req.cookies.lang });
});

app.get('*', (req, res) =>
    res.render('base/index', { debugging,
        lang: req.cookies.lang }));

query_service.conn.sync().then(() =>
    log('ready for database requests'));

notification_service.connect(() =>
    log('ready for notification requests'));

app.listen(config('port') || 3000);
log('listening for requests');
