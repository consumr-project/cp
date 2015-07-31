'use strict';

var express = require('express'),
    serve_index = require('serve-index'),
    error_handler = require('errorhandler'),
    favicon = require('serve-favicon'),
    swig = require('swig');

var app = express();

var render = function (file, params) {
    return function (req, res) {
        res.render(file, params);
    };
};

app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/modules');
app.engine('html', swig.renderFile);

app.use('/static', express.static('static'));
app.use('/app', express.static('app'));
app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));
app.use(favicon(__dirname + '/public/images/favicon.png'));

if (process.env.NODE_ENV === 'development' || !!process.env.DEBUG) {
    app.use('/app', serve_index('app'));
    app.use('/public', serve_index('public'));
    app.use(error_handler());
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

app.get('*', render('base/index', {
    debugging: !!process.env.DEBUG
}));

app.listen(process.env.PORT || 3000);
