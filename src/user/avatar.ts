import { ServiceRequestHandler } from 'cp';
import { service_redirect } from '../utilities';
import { User } from 'query-service';
import * as QueryService from '../server/query';
import * as querystring from 'querystring';

import md5 = require('md5');
import config = require('acm');

const FALLBACK = config('experience.fallback_avatar');
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

export function generate_gravatar_url(email: string, size: SIZE = SIZE.AVATAR, rating: RATING = RATING.G, user?: User): string {
    let fallback = user && user.avatar_url ? user.avatar_url : FALLBACK;

    email = (user && user.email ? user.email : email)
        .toLowerCase()
        .trim();

    return GRAVATAR_URL + md5(email) + '?' +
        querystring.stringify({
            d: fallback,
            s: size,
            r: rating,
        });
}

export function get_user_gravatar_url(email: string, size: SIZE = SIZE.AVATAR, rating: RATING = RATING.G): Promise<string> {
    return UserModel.findOne({ where: { email } })
        .then(user => generate_gravatar_url(email, size, rating, user));
}

export const get_user_gravatar_url_handler: ServiceRequestHandler = service_redirect(req =>
    get_user_gravatar_url(req.query.email, req.query.size, req.query.rating));
