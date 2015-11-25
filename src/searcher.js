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

var debug = require('debug'),
    log = debug('searcher'),
    error = debug('searcher:error');

var query_ttl = config('firebase.query_ttl');

/**
 * @param {String} str
 * @return {Object}
 */
function query(str) {
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
 * @param {Firebase} ref
 * @param {String} key
 * @return {Function(value: Object)}
 */
function updateReference(ref, key) {
    return function (value) {
        log('responding to %s', key);
        ref.child(key).set(JSON.stringify(value));
    };
}

/**
 * @param {Object} search
 * @param {String} key
 * @return {Function(Error)}
 */
function logErrored(search, key) {
    return function (err) {
        error('errored on %s {index: %s, type: %s, query: %s}: [%s]',
            key, search.index, search.type, search.query, err);
    };
}

/**
 * @param {ElasticsearchClient} elasticsearch
 * @param {Firebase} firebase
 * @return {Function(ref: Firebase)}
 */
function runSearch(elasticsearch, firebase) {
    return function (ref) {
        var val = ref.val(),
            key = ref.key();

        log('querying %s', key);
        elasticsearch.search({
            index: val.index,
            type: val.type,
            body: query(val.query)
        }).then(updateReference(firebase, key), logErrored(val, key));

        log('cleaning up in %sms', query_ttl);
        setTimeout(ref.ref().remove.bind(ref.ref()), query_ttl);
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
        body: query(search.query)
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

/**
 * @param {ElasticsearchClient} elasticsearch
 * @param {Firebase} ref
 * @return {Firebase}
 */
module.exports = function (elasticsearch, firebase) {
    var ref = firebase.child(config('firebase.search_collection'));
    ref.on('child_added', runSearch(elasticsearch, ref));
    return ref;
};

module.exports.fuzzySearch = fuzzySearch;
module.exports.handleRequest = handleRequest;
