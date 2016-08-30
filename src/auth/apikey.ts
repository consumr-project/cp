import * as passport from 'passport';
import { User } from '../service/models';

import LocalApiKey = require('passport-localapikey');

const ApiKey = LocalApiKey.Strategy;

function find_user(apikey: string, done) {
    User.findOne({
        where: {
            auth_apikey: apikey
        }
    })
        .then(user => done(null, user))
        .catch(done);
}

export default function () {
    var login = passport.authenticate('localapikey'),
        strategy = new ApiKey(find_user);

    return { login, strategy };
}
