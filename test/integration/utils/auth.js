'use strict';

const http = require('./http');

function login(apikey) {
    return http.post('/service/auth/key', { apikey });
}

function logout() {
    return http.get('/service/auth/logout');
}

function user() {
    return http.get('/service/auth/user');
}

module.exports = { login, logout, user };
