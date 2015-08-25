/* global TCP_BUILD_CONFIG, Firebase, FirebasePassportLogin, wikipedia, extract, _, highlighter, google, utils, entity */
(function () {
    'use strict';

    var store = new Firebase(TCP_BUILD_CONFIG.firebase.url),
        deps = ['ngRoute', 'ngAria'];

    var auth = new FirebasePassportLogin(store, function (err, user) {
        if (err) {
            console.log('error');
            console.log(err);
        } else if (user) {
            console.log('login');
            console.log(user);
        } else {
            console.log('logout');
        }
    }, TCP_BUILD_CONFIG.auth.url);

    if (window.DEBUGGING) {
        deps.push('rector');
    }

    angular.module('tcp', deps);

    angular.module('tcp').constant('DEBUGGING', !!window.DEBUGGING);
    angular.module('tcp').constant('CONFIG', TCP_BUILD_CONFIG);

    angular.module('tcp').value('Auth', auth);
    angular.module('tcp').value('extract', extract);
    angular.module('tcp').value('highlighter', highlighter);
    angular.module('tcp').value('lodash', _);
    angular.module('tcp').value('Store', store);
    angular.module('tcp').value('utils', utils);
    angular.module('tcp').value('wikipedia', wikipedia);

    if (!window.DEBUGGING) {
        angular.module('tcp').config(['$compileProvider', function ($compileProvider) {
              $compileProvider.debugInfoEnabled(false);
        }]);
    } else {
        window.Auth = auth;
    }
})();
