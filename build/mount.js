"use strict";
var express = require('express');
var config = require('acm');
var avatar_1 = require('./avatar');
var query_service;
var app = express();
app.get('/avatar', avatar_1["default"]);
if (!module.parent) {
    query_service = require('query-service');
    query_service.conn.sync();
    app.listen(config('port') || 3000);
}
module.exports = app;
