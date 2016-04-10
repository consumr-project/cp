import { app as auth_endpoints } from './auth';
import { app as extract_endpoints } from './extract';
import { app as notification_endpoints } from './notification';
import { app as query_endpoints } from './query';
import { app as search_endpoints } from './search';
import { app as user_endpoints } from './user';
import { app as version_endpoints } from './version';

import * as auth_service from './auth';
import * as notification_service from './notification';
import * as query_service from './query';

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

const config = require('acm');

var log = debug('cp:server'),
    app = express(),
    debugging = !!config('debug');

app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', `${__dirname}/../../assets/views`);
app.engine('html', swig.renderFile);

app.use('/build', express.static('build'));
app.use('/src/client', express.static('src/client'));
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
app.use(favicon(`${__dirname}/../../assets/images/favicon.png`));

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
app.use('/service/auth', auth_endpoints);

app.use('/service/user', timeout('5s'), user_endpoints);

app.use('/service/notification', auth_service.is_logged_in);
app.use('/service/notification', timeout('5s'), notification_endpoints);

app.use('/service/search', timeout('5s'), search_endpoints);
app.use('/service/extract', timeout('5s'), extract_endpoints);

app.delete('/service/query/*', auth_service.is_logged_in);
app.patch('/service/query/*', auth_service.is_logged_in);
app.post('/service/query/*', auth_service.is_logged_in);
app.put('/service/query/*', auth_service.is_logged_in);
app.use('/service/query', timeout('60s'), query_endpoints);
app.use('/version', version_endpoints);

app.use((req, res, next) => {
    res.cookie('lang', req.query.lang || req.query.lang || 'en', {
        expires: new Date('2099-01-01') });

    next();
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.render('index', { debugging, err,
        lang: req.cookies.lang });
});

app.get('*', (req, res) =>
    res.render('index', { debugging,
        lang: req.cookies.lang }));

query_service.conn.sync().then(() =>
    log('ready for database requests'));

notification_service.connect(() =>
    log('ready for notification requests'));

app.listen(config('port') || 3000);
log('listening for requests');
