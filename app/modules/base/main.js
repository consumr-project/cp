/* global TCP_BUILD_CONFIG, Firebase, wikipedia, extract, _, highlighter, google, utils, entity */
(function () {
    'use strict';

    var store = new Firebase(TCP_BUILD_CONFIG.firebase.url),
        deps = ['ngRoute', 'ngAria'];

    var auth = new FirebasePassportLogin(store, function (err, user) {
        debugger
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

    // XXX
    window.auth=auth;

    if (window.DEBUGGING) {
        deps.push('rector');
    }

    angular.module('tcp', deps);
    angular.module('tcp').constant('DEBUGGING', !!window.DEBUGGING);
    angular.module('tcp').value('wikipedia', wikipedia);
    angular.module('tcp').value('extract', extract);
    angular.module('tcp').value('lodash', _);
    angular.module('tcp').value('highlighter', highlighter);
    angular.module('tcp').value('utils', utils);
    angular.module('tcp').value('entity', entity);
    angular.module('tcp').value('store', store);
    // angular.module('tcp').value('postStore', store.child('post'));
    // angular.module('tcp').value('userStore', store.child('user'));
    // angular.module('tcp').value('companyStore', store.child('company'));
    // angular.module('tcp').value('tagStore', store.child('tag'));

    if (!window.DEBUGGING) {
        angular.module('tcp').config(['$compileProvider', function ($compileProvider) {
              $compileProvider.debugInfoEnabled(false);
        }]);
    }
})();
