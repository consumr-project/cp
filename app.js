'use strict';

var DEBUG = process.env.NODE_ENV === 'development';

var express = require('express'),
    serve_index = require('serve-index'),
    not_found = require('not-found'),
    error_handler = require('errorhandler');

var app = express();

app.use('/public', express.static('public'));
if (DEBUG) app.use('/public', serve_index('public'));
app.use(not_found(app.get('views') + '404.html'));
if (DEBUG) app.use(error_handler());

app.listen(process.env.PORT || 3000);
