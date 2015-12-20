'use strict';

var User = require('query-service').models.User;

/**
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} done
 */
module.exports.loggedin = function (req, res, next) {
    next(req.user ? null : new Error('Login required'));
};

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

module.exports.js_update = function (req, res) {
    res.send([
        '<script>',
        '   (function () {',
        '       var ev = opener.document.createEvent("Events");',
        '       ev.initEvent("cp:auth");',
        '       opener.document.dispatchEvent(ev);',
        '       window.close();',
        '   })();',
        '</script>'
    ].join(''));
};
