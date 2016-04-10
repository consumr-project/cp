import { User } from 'query-service';
import * as QueryService from '../../server/query';
import * as querystring from 'querystring';
import {Request, Response} from 'express';
import md5 = require('md5');

const GRAVATAR_URL = 'http://www.gravatar.com/avatar/';
const UserModel = QueryService.models.User;

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

function generate_gravatar_url(req: Request, user?: User): string {
    let fallback = user ? user.avatar_url : '';
    let email = (user ? user.email : req.query.email)
        .toLowerCase()
        .trim();

    return GRAVATAR_URL + md5(email) + '?' +
        querystring.stringify({
            d: fallback,
            s: req.query.size || SIZE.AVATAR,
            r: req.query.rating || RATING.G,
        });
}

export default function http_handler(req: Request, res: Response, next: Function) {
    UserModel.findOne({ where: { email: req.query.email } })
        .then(user => res.redirect(generate_gravatar_url(req, user)));
}
