'use strict';

var Elasticsearch = require('elasticsearch').Client;

var app = require('express')(),
    config = require('acm');

var searcher = require('./src/searcher');
var elasticsearch = new Elasticsearch({ host: config('elasticsearch.host') });

module.exports = app;
app.get('/fuzzy', searcher.handleRequest.bind(null, elasticsearch, searcher.fuzzySearch));

if (!module.parent) {
    app.listen(config('port') || 3000);
}
