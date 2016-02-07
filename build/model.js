"use strict";
var permissions = require('./permissions');
var QueryService = require('query-service');
var UserModel = QueryService.models.User;
function as_guest(req, res, next) {
    req.user = req.user || { role: permissions.roles.GUEST };
    next();
}
exports.as_guest = as_guest;
function is_logged_in(req, res, next) {
    next(req.user ? null : new Error('Login required'));
}
exports.is_logged_in = is_logged_in;
function serialize(user, done) {
    done(null, user.id);
}
exports.serialize = serialize;
function deserialize(user_id, done) {
    return UserModel.findById(user_id)
        .then(done.bind(null, null))
        .catch(done);
}
exports.deserialize = deserialize;
function js_update(req, res) {
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
}
exports.js_update = js_update;
;
