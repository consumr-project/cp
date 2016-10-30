import { WhereOptions } from 'sequelize';
import { User as UserMessage } from 'cp/record';
import { User } from '../device/models';
import * as querystring from 'querystring';
import * as config from 'acm';

import { decrypt } from '../crypto';
import { KEY_USER_EMAIL } from '../keys';

import md5 = require('md5');

const FALLBACK = config('experience.fallback_avatar');
const GRAVATAR_URL = 'http://www.gravatar.com/avatar/';

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

export function generate_gravatar_url(
    size: SIZE = SIZE.AVATAR,
    rating: RATING = RATING.G,
    user?: UserMessage
): string {
    let email = (user && user.email ?
        decrypt(user.email, KEY_USER_EMAIL) : '')
            .toLowerCase()
            .trim();

    return GRAVATAR_URL + md5(email) + '?' +
        querystring.stringify({
            d: FALLBACK,
            s: size,
            r: rating,
        });
}

export function url(
    query: WhereOptions,
    size: SIZE = SIZE.AVATAR,
    rating: RATING = RATING.G
): Promise<string> {
    return User.findOne({ where: query })
        .then(user => generate_gravatar_url(size, rating, user));
}
