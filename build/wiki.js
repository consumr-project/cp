"use strict";
var lodash_1 = require('lodash');
var getset = require('deep-get-set');
var striptags = require('striptags');
var request = require('request');
var WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';
var CHAR_NL = '\n';
var CHAR_REF = '^';
function get_or_else(val, def) {
    return val === undefined || val === null ? def : val;
}
function normalize_extract(obj) {
    return {
        id: obj.pageid,
        title: get_or_else(obj.title, ''),
        extract: lodash_1.filter(get_or_else(obj.extract, '').split(CHAR_NL), function (line) { return line[0] !== CHAR_REF; }).join(CHAR_NL).trim()
    };
}
function normalize_search_result(obj) {
    return {
        title: obj.title,
        snippet: striptags(get_or_else(obj.snippet, ''))
    };
}
function wikipedia(req, res, next, params, parser) {
    var start_time = Date.now();
    params.action = 'query';
    params.format = 'json';
    request({
        uri: WIKIPEDIA_API_URL,
        qs: params
    }, function (err, xres, body) {
        if (err) {
            next(err);
            return;
        }
        try {
            res.json({
                body: parser(JSON.parse(body)),
                meta: {
                    elapsed_time: Date.now() - start_time,
                    href: xres.request.url.href
                }
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function extract(req, res, next) {
    wikipedia(req, res, next, {
        prop: 'extracts',
        exintro: '',
        explaintext: '',
        titles: req.query.q
    }, function (body) { return lodash_1.map(getset(body, 'query.pages'), normalize_extract).pop(); });
}
exports.extract = extract;
function search(req, res, next) {
    wikipedia(req, res, next, {
        list: 'search',
        srprop: 'snippet',
        srlimit: '50',
        srsearch: req.query.q
    }, function (body) { return lodash_1.map(getset(body, 'query.search'), normalize_search_result); });
}
exports.search = search;
