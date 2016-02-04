"use strict";
var express = require('express');
var QueryService = require('query-service');
var fs_1 = require('fs');
var Elasticsearch = require('elasticsearch');
var config = require('acm');
var searcher_1 = require('./searcher');
var queryer_1 = require('./queryer');
var app = express();
var es = new Elasticsearch.Client({ host: config('elasticsearch.host') });
var sql = function (name) {
    return fs_1.readFileSync("./config/" + name + ".sql").toString();
};
app.get('/fuzzy', searcher_1.search(es, searcher_1.fuzzy));
app.get('/query', queryer_1.query(QueryService.conn, sql('search')));
!module.parent && app.listen(config('port'));
module.exports = app;
