import * as passport from 'passport';
import { Strategy } from 'passport-localapikey';
import { User } from '../device/models';

export default function () {
    var strategy = new Strategy((auth_apikey: string, done) => {
        User.findOne({ where: { auth_apikey } })
            .then(user => done(null, user))
            .catch(done);
    });

    return { strategy, login: passport.authenticate('localapikey') };
}
