'use strict';

const crypto = require('../../../build/crypto');
const KEY_USER_EMAIL = require('../../../build/keys').KEY_USER_EMAIL;

/**
 * @param {String} em
 * @return {String}
 */
function email(em) {
    return crypto.encrypt(em, KEY_USER_EMAIL);
}

module.exports = { email };
