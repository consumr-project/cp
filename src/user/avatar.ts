import { WhereOptions } from 'sequelize';
import { User } from 'cp/record';
import * as record from '../server/record';
import * as querystring from 'querystring';
import * as config from 'acm';

import md5 = require('md5');

const FALLBACK = config('experience.fallback_avatar');
const GRAVATAR_URL = 'http://www.gravatar.com/avatar/';
const UserModel = record.models.User;

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

export function generate_gravatar_url(size: SIZE = SIZE.AVATAR, rating: RATING = RATING.G, user?: User): string {
    let fallback = user && user.avatar_url ? user.avatar_url : FALLBACK;

    let email = (user && user.email ? user.email : '')
        .toLowerCase()
        .trim();

    return GRAVATAR_URL + md5(email) + '?' +
        querystring.stringify({
            d: fallback,
            s: size,
            r: rating,
        });
}

export function get_user_gravatar_url(query: WhereOptions, size: SIZE = SIZE.AVATAR, rating: RATING = RATING.G): Promise<string> {
    return UserModel.findOne({ where: query })
        .then(user => generate_gravatar_url(size, rating, user));
}
