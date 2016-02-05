'use strict';
var User = require('query-service').models.User, permissions = require('./permissions');
module.exports.as_guest = function (req, res, next) {
    req.user = req.user || { role: permissions.roles.GUEST };
    next();
};
module.exports.is_logged_in = function (req, res, next) {
    next(req.user ? null : new Error('Login required'));
};
module.exports.serialize = function (user, done) {
    done(null, user.id);
};
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
        '       ev.initEvent("cp:auth", true, false);',
        '       opener.document.dispatchEvent(ev);',
        '       window.close();',
        '   })();',
        '</script>'
    ].join(''));
};
