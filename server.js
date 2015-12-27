'use strict';

require('newrelic');

var app, config, log;

var express = require('express'),
    index = require('serve-index'),
    errors = require('errorhandler'),
    favicon = require('serve-favicon'),
    body_parser = require('body-parser'),
    cookie = require('cookie-parser'),
    timeout = require('connect-timeout'),
    session = require('express-session'),
    swig = require('swig');

var search_service = require('search-service'),
    auth_service = require('auth-service'),
    extract_service = require('extract-service'),
    query_service = require('query-service');

log = require('debug')('cp:server');
app = express();
config = require('acm');

app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/modules');
app.engine('html', swig.renderFile);

app.use('/build', express.static('build'));
app.use('/app', express.static('app'));
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
app.use(favicon(__dirname + '/assets/images/favicon.png'));

if (config('debug')) {
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
app.use('/service/auth', timeout('10s'), auth_service);

app.use('/service/search', timeout('5s'), search_service);
app.use('/service/extract', timeout('5s'), extract_service);

app.delete('/service/query/*', auth_service.loggedin);
app.patch('/service/query/*', auth_service.loggedin);
app.post('/service/query/*', auth_service.loggedin);
app.put('/service/query/*', auth_service.loggedin);
app.use('/service/query', timeout('60s'), query_service);

app.get('*', function (req, res) {
    res.render('base/index', {
        debugging: !!config('debug')
    });
});

require('query-service').conn.sync().then(function () {
    log('ready');
    app.listen(config('port') || 3000);
});
