'use strict';

var DEBUG = process.env.NODE_ENV === 'development';

var express = require('express'),
    serve_index = require('serve-index'),
    not_found = require('not-found'),
    error_handler = require('errorhandler'),
    swig = require('swig');

var app = express();

var render = function (file) {
    return function (req, res) {
        res.render(file);
    };
};

app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');
app.engine('html', swig.renderFile);

app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));
app.get('*', render('index'));
app.use(not_found(app.get('views') + '404.html'));

if (DEBUG) {
    app.use('/public', serve_index('public'));
    app.use(error_handler());
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

app.listen(process.env.PORT || 3000);
