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
app.set('views', __dirname + '/app/modules');
app.engine('html', swig.renderFile);

app.use('/app', express.static('app'));
app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.get('/extract', function (req, res) {
    require('./app/actions/extract')(req.query.url, function (results) {
        res.json(results);
    });
});

switch (process.env.NODE_ENV) {
    case 'development':
        app.use('/app', serve_index('app'));
        app.use('/public', serve_index('public'));
        app.use(error_handler());
        app.set('view cache', false);
        swig.setDefaults({ cache: false });
        break;
}

app.get('*', render('base/index'));
app.listen(process.env.PORT || 3000);
