"use strict";
var lodash_1 = require('lodash');
var config = require('acm');
var request = require('request');
var CRUNCHBASE_ORG_URL = 'https://api.crunchbase.com/v/3/organizations';
var CRUNCHBASE_API_KEY = config('crunchbase.api.key');
function flatten_company(company) {
    company.properties.uuid = company.uuid;
    company.properties.type = company.type;
    return company.properties;
}
function handle_response(err, res, next, body) {
    var parsed;
    if (err) {
        next(err);
        return;
    }
    try {
        parsed = JSON.parse(body);
        res.json({
            body: lodash_1.map(parsed.data.items, flatten_company),
            meta: parsed.data.paging
        });
    }
    catch (ignore) {
        err = new Error('could not parse response');
        next(err);
        return;
    }
}
function companies(req, res, next) {
    var uri = CRUNCHBASE_ORG_URL, user_key = CRUNCHBASE_API_KEY;
    var query = req.query.q, page = req.query.page || 1;
    request({ uri: uri, qs: { query: query, page: page, user_key: user_key } }, function (err, xres, body) {
        return handle_response(err, res, next, body);
    });
}
exports.companies = companies;
