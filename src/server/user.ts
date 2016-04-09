import * as express from 'express';
import avatar from '../service/user/avatar';
import config = require('acm');

export var app = express();

app.get('/avatar', avatar);
