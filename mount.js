'use strict';

var app = require('express')(),
    config = require('acm');

module.exports = app;
app.get('/page', require('./src/page'));
app.get('/wiki/extracts', require('./src/wiki').query_extracts);

if (!module.parent) {
    app.listen(config('port') || 3000);
}
