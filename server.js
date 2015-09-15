'use strict';

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
fb = new Firebase(config.get('firebase.url'));

app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/modules');
app.engine('html', swig.renderFile);

app.use('/build', express.static('build'));
app.use('/app', express.static('app'));
app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));
app.use(favicon(__dirname + '/public/images/favicon.png'));

if (process.env.NODE_ENV === 'development' || !!config.get('debug')) {
    app.use('/app', serve_index('app'));
    app.use('/public', serve_index('public'));
    app.use(error_handler());
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

app.use(body_parser.json());
app.use(cookie_parser(config.get('session.secret')));
app.use(session({ secret: config.get('session.secret') }));

require('./app/auth/main')(app);
require('./app/auth/linkedin')(app, config, fb);

app.get('*', function (req, res) {
    res.render('base/index', {
        debugging: !!config.get('debug')
    });
});

app.listen(config.get('port') || 3000);
