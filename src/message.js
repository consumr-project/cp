'use strict';

/**
 * supported message types
 */
var TYPE = {
    EMAIL: 0
};

/**
 * Message model
 */
function Message(config) {
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
