import * as passport from 'passport';
import * as QueryService from '../../server/query';
import LocalApiKey = require('passport-localapikey');

const ApiKey = LocalApiKey.Strategy;
const UserModel = QueryService.models.User;

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
