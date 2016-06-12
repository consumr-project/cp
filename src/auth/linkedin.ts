import { Request, Response } from 'express';
import { Profile } from 'passport-linkedin-oauth2';
import { WhereOptions } from 'sequelize';
import { User } from 'cp/query';

import { roles } from './permissions';
import { get } from 'lodash';
import { parse } from 'url';

import * as passport from 'passport';
import * as QueryService from '../server/query';

import config = require('acm');
import uuid = require('node-uuid');
import PassportLinkedInOauth2 = require('passport-linkedin-oauth2');

const UserModel = QueryService.models.User;
const LinkedInStrategy = PassportLinkedInOauth2.Strategy;

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

function generate_where(profile: Profile): WhereOptions {
    return {
        auth_linkedin_id: profile.id
    };
}

function generate_user(profile: Profile): User {
    var id = uuid.v4();

    return {
        id: id,
        role: roles.USER,
        auth_linkedin_id: profile.id,
        avatar_url: profile._json.pictureUrl,
        company_name: <string>get(profile._json, 'positions.values.0.company.name'),
        created_by: id,
        created_date: Date.now(),
        email: profile._json.emailAddress,
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

function find_user(token: string, tokenSecret: string, profile: Profile, done: (err: any) => any): Promise<User> {
    return UserModel.findOrCreate({
        where: generate_where(profile),
        defaults: generate_user(profile)
    })
        .spread(done.bind(null, null))
        .catch(done);
}

function set_callback_url(strategy: PassportLinkedInOauth2.Strategy, req: Request, res: Response, next: Function) {
    strategy._callbackURL = get_callback_url(req);
    next(null);
}

function get_callback_url(req: Request): string {
    var parts = parse(req.originalUrl);
    return req.protocol + '://' + req.get('host') + parts.pathname + '/callback';
}

export default function () {
    var configuration = {
        clientID: config('linkedin.client_id'),
        clientSecret: config('linkedin.client_secret'),
        profileFields: PROFILE_FIELDS,
        scope: SCOPE,
        callbackURL: '',
    };

    var login = passport.authenticate('linkedin', { state: '____' }),
        callback = passport.authenticate('linkedin', { failureRedirect: '/error?with=linkedin-login' }),
        strategy = new LinkedInStrategy(configuration, find_user),
        pre_base = set_callback_url.bind(null, strategy);

    return { login, strategy, callback, pre_base };
}
