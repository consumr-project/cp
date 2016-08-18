import * as passport from 'passport';
import models from '../service/models';

import LocalApiKey = require('passport-localapikey');

const ApiKey = LocalApiKey.Strategy;
const UserModel = models.User;

function find_user(apikey: string, done) {
    UserModel.findOne({
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
