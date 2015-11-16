'use strict';

/**
 * supported message types
 */
var TYPE = {
    EMAIL: 0
};

/**
 * semi-unique identifier
 * @return {String}
 */
function id() {
    return (Date.now() + Math.random().toString().substr(2)).substr(0, 25);
}

/**
 * Message model
 */
function Message(config) {
    /**
     * @type {String}
     */
    this.id = config.id || id();

    /**
     * @type {TYPE}
     */
    this.type = config.type;

    /**
     * ie. "welcome" for welcome email
     * @type {String}
     */
    this.subject = config.subject;

    /**
     * anything
     * @type {Object}
     */
    this.payload = config.payload || {};
}

module.exports = Message;
module.exports.TYPE = TYPE;
