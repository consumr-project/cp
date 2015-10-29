'use strict';

var INDEX = 'entity';

var contains = require('lodash/collection/contains'),
    pick = require('lodash/object/pick');

var debug = require('debug'),
    log = debug('indexer'),
    error = debug('indexer:error');

/**
 * @param {String} type of index
 * @param {String} key of document
 * @return {Function}
 */
function logIndexed(type, key) {
    return function () {
        log('indexed %s/%s/%s', INDEX, type, key);
    };
}

/**
 * @param {String} type of index
 * @param {String} key of document
 * @return {Function}
 */
function logErrored(type, key) {
    return function () {
        error('error %s/%s/%s', INDEX, type, key);
    };
}

/**
 * @param {ElasticsearchClient} elasticsearch
 * @param {String} type
 * @param {Array<String>} fields
 * @return {Function(ref: Firebase)}
 */
function indexUpsert(elasticsearch, type, fields) {
    return function (ref) {
        var key = ref.key(),
            val = ref.val();

        var data = pick(ref.val(), function (val, key) {
            return contains(fields, key);
        });

        elasticsearch.index(INDEX, type, data, key)
            .on('data', logIndexed(type, key))
            .on('error', logErrored(type, key))
            .exec();

        log('upsert %s/%s/%s', INDEX, type, key);
    };
}

/**
 * @param {ElasticsearchClient} elasticsearch
 * @param {String} type
 * @return {Function(ref: Firebase)}
 */
function indexRemove(elasticsearch, type) {
    return function (ref) {
        var key = ref.key();
        log('remove %s/%s/%s', INDEX, type, key);
        error('indexRemove function has not been implemented');
    };
}

/**
 * @param {ElasticsearchClient} elasticsearch
 * @param {Firebase} ref
 * @param {String} type
 * @param {Array<String>} fields
 * @return {Firebase}
 */
module.exports = function (elasticsearch, firebase, type, fields) {
    var ref = firebase.child(type);
    log('binding to %s', type);
    ref.on('child_added', indexUpsert(elasticsearch, type, fields));
    ref.on('child_changed', indexUpsert(elasticsearch, type, fields));
    ref.on('child_removed', indexRemove(elasticsearch, type));
    return ref;
};
