import * as express from 'express';
import config = require('acm');
import avatar from './avatar';

export var app = express();

app.get('/avatar', avatar);

!module.parent && app.listen(config('port') || 3000);
