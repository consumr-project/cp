import * as QueryService from 'query-service';
import * as querystring from 'querystring';
import {Request, Response} from 'express';
import md5 = require('md5');

const GRAVATAR_URL = 'http://www.gravatar.com/avatar/';
const User = QueryService.models.User;

export enum RATING {
    G = <any>'g',
    PG = <any>'pg',
    R = <any>'r',
    X = <any>'x',
}

export enum SIZE {
    AVATAR = 512,
    MEDIUM = 1024,
    LARGE = 1536,
    FULL = 2048,
}

function generate_gravatar_url(user: QueryService.User): string {
    return GRAVATAR_URL + md5(user.email.trim().toLowerCase()) + '?' +
        querystring.stringify({
            d: user.avatar_url,
            s: SIZE.AVATAR,
            r: RATING.G,
        });
}

export default function http_handler(req: Request, res: Response, next: Function) {
    User.findOne({ where: { email: req.query.email } })
        .then((user) => res.redirect(generate_gravatar_url(user)));
}
