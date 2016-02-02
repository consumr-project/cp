"use strict";
var express = require('express');
var config = require('acm');
var avatar_1 = require('./avatar');
var app = express();
app.get('/avatar', avatar_1["default"]);
!module.parent && app.listen(config('port') || 3000);
module.exports = app;
