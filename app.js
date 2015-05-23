'use strict';

var express = require('express'),
    serve_index = require('serve-index'),
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

switch (process.env.NODE_ENV) {
    case 'development':
        app.use('/public', serve_index('public'));
        app.use(error_handler());
        app.set('view cache', false);
        swig.setDefaults({ cache: false });
        break;
}

app.listen(process.env.PORT || 3000);
