'use strict'

var BASE = 'search';

var config = require('acm');

var debug = require('debug'),
    log = debug('searcher'),
    error = debug('searcher:error');

/**
 * @param {String} str
 * @return {Object}
 */
function query(str) {
    return {
        query: {
            fuzzy_like_this: {
                fuzziness: config('elasticsearch.query.fuzziness'),
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
        ref.child(key).set(value);
    };
}

/**
 * @param {Object} search
 * @parma {String} key
 */
function logErrored(search, key) {
    return function () {
        error('errored on %s {index: %s, type: %s, query: %s}',
            key, search.index, search.type, search.query);
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
        elasticsearch.search(val.index, val.type, query(val.query))
            .on('data', updateReference(firebase, key))
            .on('error', logErrored(val, key))
            .exec();
    };
}

/**
 * @param {ElasticsearchClient} elasticsearch
 * @param {Firebase} ref
 * @return {Firebase}
 */
module.exports = function (elasticsearch, firebase) {
    var ref = firebase.child(BASE);
    ref.on('child_added', runSearch(elasticsearch, ref));
    return ref;
}
