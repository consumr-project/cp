import { WhereOptions } from 'sequelize';
import { UserMessage } from '../record/models/user';
import { User } from '../device/models';
import { save, Model, Payload } from '../device/upload';
import { includes } from 'lodash';
import * as querystring from 'querystring';
import * as config from 'acm';
import * as md5 from 'md5';

import { decrypt } from '../crypto';
import { KEY_USER_EMAIL } from '../keys';

const FALLBACK = config('experience.fallback_avatar');
const GRAVATAR_URL = 'http://www.gravatar.com/avatar/';

export const SUPPORTED_MIMES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
];

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

export function valid_image_type(file: { mimetype: string }): boolean {
    return includes(SUPPORTED_MIMES, file.mimetype);
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
    return save(new Payload.ImgurImage(base64))
        .then((res: Model.ImgurImage) => res.link);
}
