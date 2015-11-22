'use strict';

module.exports.serialize = function (user, done) {
    done(null, user.guid);
};

module.exports.deserialize = function (user, done) {
    done(null, { guid: user.guid });
};
