import { WhereOptions } from 'sequelize';
import { User as UserMessage } from 'cp/record';
import { User } from '../device/models';
import * as querystring from 'querystring';
import * as config from 'acm';
import * as md5 from 'md5';
import * as imgur from 'imgur';

import { decrypt } from '../crypto';
import { KEY_USER_EMAIL } from '../keys';

const IMGUR_ALBUM_ID = config('files.avatars.imgur.album_id');
const IMGUR_CLIENT_ID = config('files.avatars.imgur.client_id');
const IMGUR_PASSWORD = config('files.avatars.imgur.password');
const IMGUR_USERNAME = config('files.avatars.imgur.username');

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
        .then(user => user && user.avatar_url ||
            generate_gravatar_url(size, rating, user));
}

export function upload(base64: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        imgur.setCredentials(IMGUR_USERNAME, IMGUR_PASSWORD, IMGUR_CLIENT_ID);
        imgur.uploadBase64(base64, IMGUR_ALBUM_ID)
            .then(res => resolve(res.data.link))
            .catch(reject);
    });
}
