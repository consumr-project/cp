'use strict';

const config = require('acm');
const crypto = require('../../build/crypto');

const Models = require('../../build/device/models');
const User = Models.User;

/**
 * @param {Number} code
 */
function exit(code) {
    process.exit(code || 0);
}

/**
 * @param {Error} err
 */
function err_handler(err) {
    console.log(err.message);
    exit(1);
}

/**
 * @param {Promise}
 * @return {Promise}
 */
function guard(pro) {
    return pro.catch(err_handler);
}

/**
 * @return {Promise<boolean>}
 */
function should_run() {
    return guard(User.findOne({
        where: {
            id: config('seed.user.root.id'),
            email: config('seed.user.root.raw_email'),
        }
    }).then(user => !!user));
}

/**
 * @param {String} em
 * @return {String}
 */
function email(em) {
    return crypto.encrypt(em, crypto.KEY_USER_EMAIL);
}

/**
 * @return {Promise<*>}
 */
function main() {
    return should_run().then(run => {
        if (!run) {
            exit(0);
            return;
        }

        guard(User.findAll().then(users => {
            guard(Promise.all(users.map(user => {
                user.email = email(user.email);
                return user.save();
            })).then(() => exit()));
        }));
    });
}

guard(main());
