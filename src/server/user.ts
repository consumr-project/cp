import * as express from 'express';
import { get_user_gravatar_url_handler } from '../user/avatar';

export var app = express();

app.get('/avatar', get_user_gravatar_url_handler);
