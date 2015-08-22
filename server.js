'use strict';

var express = require('express'),
    serve_index = require('serve-index'),
    error_handler = require('errorhandler'),
    favicon = require('serve-favicon'),
    body_parser = require('body-parser'),
    cookie_parser = require('cookie-parser'),
    session = require('express-session'),
    swig = require('swig');

var passport = require('passport'),
    LinkedInStrategy = require('passport-linkedin').Strategy;

var Firebase = require('firebase'),
    FirebaseToken = require('firebase-token-generator');

var app = express(),
    config = require('acm');

var auth_callback_url = config.get('session.auth.callback_url'),
    auth_cookie = config.get('session.auth.cookie'),
    firebase_url = config.get('firebase.url'),
    firebase_secret = config.get('firebase.secret'),
    linkedin_client_id = config.get('linkedin.client_id'),
    linkedin_client_secret = config.get('linkedin.client_secret');

var token = new FirebaseToken(firebase_secret);

app.set('view cache', true);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/modules');
app.engine('html', swig.renderFile);

app.use('/static', express.static('static'));
app.use('/app', express.static('app'));
app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));
app.use(favicon(__dirname + '/public/images/favicon.png'));

if (process.env.NODE_ENV === 'development' || !!config.get('debug')) {
    app.use('/app', serve_index('app'));
    app.use('/public', serve_index('public'));
    app.use(error_handler());
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
}

app.use(body_parser.json());
app.use(cookie_parser(config.get('session.secret')));
app.use(session({ secret: config.get('session.secret') }));
app.use(passport.initialize());
app.use(passport.session());
passport._key='oauth:linkedin'

passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (user, done) {
    done(null, { uid: user.uid });
});

passport.use(new LinkedInStrategy({
    consumerKey: linkedin_client_id,
    consumerSecret: linkedin_client_secret,
    callbackURL: auth_callback_url
}, function (access, refresh, profile, done) {
    return done(null, {
        accessToken: access || '',
        displayName: profile.name,
        id: profile.id,
        provider: profile.provider,
        refreshToken: refresh || '',
        thirdPartyUserData: profile._json,
        uid: profile.provider + ':' + profile.id
    });
}));

app.get('/auth/linkedin', function (req, res, next) {
    res.cookie(auth_cookie, req.query.oAuthTokenPath, { signed: true });
    passport.authenticate('linkedin', { state: '_____' })(req, res, next);
});

app.get('/auth/linkedin/callback', function (req, res, next) {
    var auth = new Firebase(firebase_url);

    passport.authenticate('linkedin', function (err, user, info) {
        auth.auth(firebase_secret, function (err, data) {
            var tok;

            auth.child('oAuthToken')
                .child(user.uid)
                .set(user.accessToken);

            if (user) {
                tok = token.createToken(user);
            }

            auth.child(req.signedCookies[auth_cookie])
                .set(tok);

            // res.send('done');
        });
    })(req, res, next);
});

app.get('*', function (req, res) {
    res.render('base/index', {
        debugging: !!config.get('debug')
    });
});

app.listen(config.get('port') || 3000);
