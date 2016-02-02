"use strict";
var express = require('express');
var config = require('acm');
var crunchbase_1 = require('./crunchbase');
var wiki_1 = require('./wiki');
var page_1 = require('./page');
exports.app = express();
exports.app.get('/page', page_1.extract);
exports.app.get('/crunchbase/companies', crunchbase_1.companies);
exports.app.get('/wiki/search', wiki_1.search);
exports.app.get('/wiki/extract', wiki_1.extract);
if (!module.parent) {
    exports.app.listen(config('port') || 3000);
}
