'use strict';

const Message = require('./message');
const clone = require('lodash/lang/clone');

const TYPE = {
    MISSING_INFORMATION: 'MISSING_INFORMATION'
};

/**
 * @param {MongoClient.Collection} coll
 * @param {String} subject
 * @param {String} to
 * @param {Object} payload
 * @param {Function} [cb]
 */
function push(coll, subject, to, payload, cb) {
    coll.insert(new Message({
        subject,
        payload,
        to,
        type: Message.TYPE.NOTIFICATION
    }), cb || () => {});
}

/**
 * @param {MongoClient.Collection} coll
 * @param {String} subject
 * @param {Object} [extra]
 * @param {Function} cb
 */
function find(coll, subject, extra, cb) {
    var query;

    if (!cb && extra && extra instanceof Function) {
        cb = extra;
        extra = {};
    }

    query = clone(extra || {});
    query.type = Message.TYPE.NOTIFICATION;

    if (subject) {
      query.subject = subject;
    }

    coll.find(query).toArray(cb);
}

/**
 * @param {MongoClient.Collection} coll
 * @param {String} id
 * @param {String} to
 * @param {Function} cb
 */
function remove(coll, id, to, cb) {
    coll.remove({id, to}, function () {
        console.log(arguments);
        cb();
    });
}

module.exports.TYPE = TYPE;

module.exports.push = push;
module.exports.find = find;
module.exports.remove = remove;
