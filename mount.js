'use strict';

const express = require('express');
const config = require('acm');

var app = express();

app.get('/avatar', require('./src/avatar'));

module.exports = app;

if (!module.parent) {
    app.listen(config('port') || 3000);
}
