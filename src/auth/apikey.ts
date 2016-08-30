import * as passport from 'passport';
import { Strategy } from 'passport-localapikey';
import { User } from '../service/models';

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
        strategy = new Strategy(find_user);

    return { login, strategy };
}
