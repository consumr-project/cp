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

    query = clone(extra || {});
    query.subject = subject;
    query.type = Message.TYPE.NOTIFICATION;

    coll.find(query).toArray(cb);
}

/**
 * @param {MongoClient.Collection} coll
 * @param {String} user_id
 * @param {Function} cb
 */
function get_missing_information_notifications(coll, user_id, cb) {
    find(coll, TYPE.MISSING_INFORMATION, { 'payload.user_id': user_id }, cb);
}

module.exports.TYPE = TYPE;

module.exports.push = push;
module.exports.find = find;
module.exports.get_missing_information_notifications = get_missing_information_notifications;
