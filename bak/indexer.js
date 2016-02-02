'use strict';

// /**
//  * @param {ElasticsearchClient} es
//  * @param {Sequelize.Model} model
//  * @param {Array<String>} fields
//  * @return {Function}
//  */
// function bind(es, model, fields) {
//     return () => {
//     };
// }
//
// module.exports = bind;

// var INDEX = 'entity';
//
// var includes = require('lodash/includes'),
//     pick = require('lodash/pick');
//
// var debug = require('debug'),
//     log = debug('indexer'),
//     error = debug('indexer:error');
//
// /**
//  * @param {String} action
//  * @param {String} type of index
//  * @param {String} key of document
//  * @return {Function}
//  */
// function logIndexed(action, type, key) {
//     return function () {
//         log('%s %s/%s/%s', action, INDEX, type, key);
//     };
// }
//
// /**
//  * @param {String} type of index
//  * @param {String} key of document
//  * @return {Function(Error)}
//  */
// function logErrored(type, key) {
//     return function (err) {
//         error('error %s/%s/%s: [%s]', INDEX, type, key, err);
//     };
// }
//
// /**
//  * @param {ElasticsearchClient} elasticsearch
//  * @param {String} type
//  * @param {Array<String>} fields
//  * @return {Function(ref: Firebase)}
//  */
// function indexUpsert(elasticsearch, type, fields) {
//     return function (ref) {
//         var key = ref.key(),
//             val = ref.val();
//
//         var data = pick(val, function (val, key) {
//             return includes(fields, key);
//         });
//
//         elasticsearch.index({
//             index: INDEX,
//             type: type,
//             id: key,
//             body: data
//         }).then(logIndexed('indexed', type, key), logErrored(type, key));
//
//         log('upsert %s/%s/%s', INDEX, type, key);
//     };
// }
//
// /**
//  * @param {ElasticsearchClient} elasticsearch
//  * @param {String} type
//  * @return {Function(ref: Firebase)}
//  */
// function indexRemove(elasticsearch, type) {
//     return function (ref) {
//         var key = ref.key();
//
//         elasticsearch.delete({
//             index: INDEX,
//             type: type,
//             id: key
//         }).then(logIndexed('deleted', type, key), logErrored(type, key));
//
//         log('remove %s/%s/%s', INDEX, type, key);
//     };
// }
//
// /**
//  * @param {ElasticsearchClient} elasticsearch
//  * @param {Firebase} ref
//  * @param {String} type
//  * @param {Array<String>} fields
//  * @return {Firebase}
//  */
// module.exports = function (elasticsearch, firebase, type, fields) {
//     var ref = firebase.child(type);
//     log('binding to %s', type);
//     ref.endAt().limitToLast(1).on('child_added', indexUpsert(elasticsearch, type, fields));
//     ref.on('child_changed', indexUpsert(elasticsearch, type, fields));
//     ref.on('child_removed', indexRemove(elasticsearch, type));
//     return ref;
// };
