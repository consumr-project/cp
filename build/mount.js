"use strict";
var express = require('express');
var config = require('acm');
var crunchbase_1 = require('./crunchbase');
var page_1 = require('./page');
var wiki_1 = require('./wiki');
var app = express();
app.get('/page', page_1.extract);
app.get('/crunchbase/companies', crunchbase_1.companies);
app.get('/wiki/search', wiki_1.search);
app.get('/wiki/extract', wiki_1.extract);
app.get('/wiki/infobox', wiki_1.infobox);
!module.parent && app.listen(config('port') || 3000);
module.exports = app;
