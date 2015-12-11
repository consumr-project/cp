'use strict';

var User = require('query-service').models.User;

/**
 * @param {auth_service.User} user
 * @param {Function} done
 */
module.exports.serialize = function (user, done) {
    done(null, user.id);
};

/**
 * @param {String} user_id
 * @param {Function} done
 * @return {Promise}
 */
module.exports.deserialize = function (user_id, done) {
    return User.findById(user_id)
        .then(done.bind(null, null))
        .catch(done);
};
