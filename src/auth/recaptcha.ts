import * as config from 'acm';
import * as request from 'request';
import { try_func } from '../utilities';
import { BadRequestError, BadGatewayError,
    ERR_MSG_PARSING_ERROR } from '../errors';

const GOOGLE_RECAPTCHA_ENDPOINT = config('google.recaptcha.endpoint');
const GOOGLE_RECAPTCHA_SECRET = config('google.recaptcha.secret');

export function recaptcha(response: string, remoteip: string) {
    return new Promise<boolean>((resolve, reject) => {
        request({
            method: 'POST',
            uri: GOOGLE_RECAPTCHA_ENDPOINT,
            formData: { response, remoteip,
                secret: GOOGLE_RECAPTCHA_SECRET }
        }, (err, res, body) => {
            var [ parse_err, check ] = try_func(() => JSON.parse(body));

            if (err) {
                reject(err);
            } else if (parse_err) {
                reject(new BadGatewayError(ERR_MSG_PARSING_ERROR('google')));
            } else if (!check.success) {
                reject(new BadRequestError('failed to verify recaptcha'));
            } else {
                resolve(true);
            }
        });
    });
}
