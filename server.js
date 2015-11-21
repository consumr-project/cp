'use strict';

require('newrelic');

var app, config, fb;

var Firebase = require('firebase');

var express = require('express'),
    serve_index = require('serve-index'),
    error_handler = require('errorhandler'),
    favicon = require('serve-favicon'),
    body_parser = require('body-parser'),
    cookie_parser = require('cookie-parser'),
    session = require('express-session'),
    swig = require('swig');

app = express();
config = require('acm');
fb = new Firebase(config('firebase.url'));

app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/modules');
app.engine('html', swig.renderFile);

app.use('/build', express.static('build'));
app.use('/app', express.static('app'));
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
app.use(favicon(__dirname + '/assets/images/favicon.png'));

if (process.env.NODE_ENV === 'development' || !!config('debug')) {
    app.use('/app', serve_index('app'));
    app.use('/assets', serve_index('assets'));
    app.use(error_handler());
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

app.use(body_parser.json());
app.use(cookie_parser(config('session.secret')));
app.use(session({ secret: config('session.secret') }));

require('./node_modules/auth-service/src/main')(app);
require('./node_modules/auth-service/src/linkedin')(app, config, fb);
app.use('/service/extract', require('./node_modules/extract-service/service'));

app.get('*', function (req, res) {
    res.render('base/index', {
        debugging: !!config('debug')
    });
});

app.listen(config('port') || 3000);
