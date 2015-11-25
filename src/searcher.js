'use strict'

/**
 * interface Query {
 * }
 *
 * interface Search {
 *     size?: Number,
 *     from?: Number,
 *     type?: String,
 *     index: String,
 *     body: Query
 * }
 */
var config = require('acm');

/**
 * @param {String} str
 * @return {Query}
 */
function fuzzyQuery(str) {
    return {
        query: {
            fuzzy_like_this: {
                fuzziness: config('elasticsearch.fuzziness'),
                like_text: str
            }
        }
    };
}

/**
 * @param {ElasticsearchClient} elasticsearch
 * @param {Search} search
 * @return {Promise}
 */
function fuzzySearch(elasticsearch, search) {
    return elasticsearch.search({
        size: search.size,
        from: search.from,
        index: search.index,
        type: search.type,
        body: fuzzyQuery(search.query)
    });
}

/**
 * @param {ElasticsearchClient} elasticsearch
 * @param {Function} searchFn
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} next
 */
function handleRequest(elasticsearch, searchFn, req, res, next) {
    searchFn(elasticsearch, req.query)
        .catch(next)
        .then(function (results) {
            res.json(results);
        });
}

module.exports.fuzzySearch = fuzzySearch;
module.exports.handleRequest = handleRequest;
