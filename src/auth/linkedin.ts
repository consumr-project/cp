import { Request, Response } from 'express';
import * as Schema from 'cp/record';
import { encrypt } from '../crypto';
import { KEY_USER_EMAIL } from '../keys';

import { roles } from './permissions';
import { get } from 'lodash';
import { parse } from 'url';
import { v4 } from 'node-uuid';

import { LOCKEDDOWN, InvalidBetaUserError } from '../auth/lockdown';
import { AllowedEmail, User } from '../service/models';
import { Strategy, Profile } from 'passport-linkedin-oauth2';
import * as passport from 'passport';
import * as config from 'acm';

const CLIENT_ID = config('linkedin.client_id');
const CLIENT_SECRET = config('linkedin.client_secret');

const SCOPE = [
    'r_basicprofile',
    'r_emailaddress',
];

const PROFILE_FIELDS = [
    'id',
    'first-name',
    'last-name',
    'email-address',
    'headline',
    'summary',
    'positions',
    'picture-url',
    'public-profile-url',
];


function generate_user(profile: Profile): Schema.User {
    var id = v4();

    return {
        id: id,
        role: roles.USER,
        auth_linkedin_id: profile.id,
        avatar_url: profile._json.pictureUrl,
        company_name: <string>get(profile._json, 'positions.values.0.company.name'),
        created_by: id,
        created_date: Date.now(),
        email: encrypt(profile._json.emailAddress, KEY_USER_EMAIL),
        lang: 'en',
        last_login_date: Date.now(),
        linkedin_url: profile._json.publicProfileUrl,
        name: profile.displayName || [profile._json.firstName, profile._json.lastName].join(' '),
        summary: profile._json.summary,
        title: profile._json.headline,
        updated_by: id,
        updated_date: Date.now(),
    };
}

function find_user(
    token: string,
    tokenSecret: string,
    profile: Profile,
    done: (err?: any, user?: Schema.User) => any
): void {
    var user = generate_user(profile);

    var create = () => User.create(user)
        .then(done.bind(null, null))
        .catch(done);

    if (!user.auth_linkedin_id) {
        done(new Error('Missing auth_linkedin_id'));
        return;
    }

    // existing user?
    User.findOne({ where: { auth_linkedin_id: user.auth_linkedin_id } })
        .then(user_found => {
            if (user_found) {
                // if found, valid
                done(null, user_found);
            } else if (LOCKEDDOWN) {
                // otherwise check if in allowed email list
                AllowedEmail.findOne({ where: { email: user.email } })
                    .then(allowed => {
                        if (allowed) {
                            create();
                        } else {
                            done(new InvalidBetaUserError());
                        }
                    })
                    .catch(done);
            } else {
                create();
            }
        })
        .catch(done);
}

function set_callback_url(strategy: Strategy, req: Request, res: Response, next: Function) {
    strategy._callbackURL = get_callback_url(req);
    next(null);
}

function get_callback_url(req: Request): string {
    var parts = parse(req.originalUrl);
    return req.protocol + '://' + req.get('host') + parts.pathname + '/callback';
}

export default function () {
    var configuration = {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        profileFields: PROFILE_FIELDS,
        scope: SCOPE,
        callbackURL: '',
    };

    var login = passport.authenticate('linkedin', { state: '____' }),
        callback = passport.authenticate('linkedin', { failureRedirect: '/error?with=linkedin-login' }),
        strategy = new Strategy(configuration, find_user),
        setup = set_callback_url.bind(null, strategy);

    return { login, strategy, callback, setup };
}
