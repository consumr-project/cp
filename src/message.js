'use strict';

const uuid = require('node-uuid');

class Message {
    /**
     * @param {String} id
     * @param {Message.TYPE} type
     * @param {String} subject ie. "welcome" for welcome email
     * @param {String} to user id this message is for
     * @param {Object} payload
     */
    constructor(config) {
        if (!(config.type in Message.TYPE)) {
            throw new Error(`Invalid type: ${config.type}`);
        }

        this.id = config.id || uuid.v4();
        this.type = config.type;
        this.to = config.to;
        this.subject = config.subject || config.type;
        this.payload = config.payload || {};
    }
}

/**
 * supported message types
 */
Message.TYPE = {
    EMAIL: 'EMAIL',
    NOTIFICATION: 'NOTIFICATION'
};

module.exports = Message;
