'use strict';

const Message = require('./message');
const clone = require('lodash/lang/clone');

const TYPE = {
    MISSING_INFORMATION: 'MISSING_INFORMATION'
};

/**
 * @param {MongoClient.Collection} coll
 * @param {String} subject
 * @param {Object} payload
 * @param {Function} [cb]
 */
function push(coll, subject, payload, cb) {
    coll.insert(new Message({
        subject,
        payload,
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

    if (subject) {
      query.subject = subject;
    }

    query = clone(extra || {});
    query.type = Message.TYPE.NOTIFICATION;

    coll.find(query).toArray(cb);
}

module.exports.TYPE = TYPE;

module.exports.push = push;
module.exports.find = find;
