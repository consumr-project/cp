'use strict';

function create(http) {
    function login(apikey) {
        return http.post('/service/auth/key', { apikey });
    }

    function logout() {
        return http.get('/service/auth/logout');
    }

    function user() {
        return http.get('/service/auth/user');
    }

    return { login, logout, user };
}

module.exports = create(require('./http'));
module.exports.create = create;
