'use strict';

const crypto = require('../../../build/crypto');

/**
 * @param {String} em
 * @return {String}
 */
function email(em) {
    return crypto.encrypt(em, crypto.KEY_USER_EMAIL);
}

module.exports = { email };
