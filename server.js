'use strict';

require('newrelic');

var app, config, log;

var express = require('express'),
    debug = require('debug'),
    index = require('serve-index'),
    errors = require('errorhandler'),
    favicon = require('serve-favicon'),
    body_parser = require('body-parser'),
    cookie = require('cookie-parser'),
    timeout = require('connect-timeout'),
    session = require('express-session'),
    swig = require('swig');

log = debug('cp:server');
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

app.use('/service/search', timeout('5s'), require('search-service'));
app.use('/service/auth', timeout('10s'), require('auth-service'));
app.use('/service/extract', timeout('5s'), require('extract-service'));
app.use('/service/query', timeout('60s'), require('query-service'));

app.get('*', function (req, res) {
    res.render('base/index', {
        debugging: !!config('debug')
    });
});

require('query-service').conn.drop().then(function () {
require('query-service').conn.sync().then(function () {
    log('ready');
    app.listen(config('port') || 3000);
});
});
