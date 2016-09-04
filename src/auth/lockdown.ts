import * as config from 'acm';

export const LOCKEDDOWN = !!config('cp.auth.lockdown');

export class InvalidBetaUserError extends Error {
    name = 'Invalid Beta User Error';
    message = 'This email has not beed added to the whitelist.';
}
