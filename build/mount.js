"use strict";
var express = require('express');
var config = require('acm');
var avatar_1 = require('./avatar');
exports.app = express();
exports.app.get('/avatar', avatar_1["default"]);
!module.parent && exports.app.listen(config('port') || 3000);
