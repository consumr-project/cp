'use strict';

var app = module.exports = require('express')(),
    config = require('acm');

app.get('/page', require('./src/page'));
app.get('/wiki/search', require('./src/wiki').search);
app.get('/wiki/extract', require('./src/wiki').extract);

if (!module.parent) {
    app.listen(config('port') || 3000);
}
