"use strict";
var lodash_1 = require('lodash');
var config = require('acm');
function get_meta(res) {
    return {
        timed_out: res.timed_out,
        took: res.took,
        total: res.hits.total
    };
}
function make_result(hit) {
    return {
        id: hit._id,
        index: hit._index,
        score: hit._score,
        type: hit._type,
        source: hit._source
    };
}
function make_response(res) {
    return {
        meta: get_meta(res),
        body: lodash_1.map(res.hits.hits, make_result)
    };
}
function fuzzy(es, query) {
    return es.search({
        from: query.from,
        index: query.index,
        size: query.size,
        type: query.type,
        body: {
            query: {
                fuzzy_like_this: {
                    fuzziness: config('elasticsearch.fuzziness'),
                    like_text: query.query
                }
            }
        }
    });
}
exports.fuzzy = fuzzy;
function search(es, searcher) {
    return function (req, res, next) {
        return searcher(es, req.query).then(function (body) {
            return res.json(make_response(body));
        });
    };
}
exports.search = search;
