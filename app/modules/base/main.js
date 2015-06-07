/* global Firebase, wikipedia, extract, _, highlighter, google, utils */
(function () {
    'use strict';

    var store = new Firebase('https://aryel---rtfm.firebaseio.com/tcp');

    angular.module('tcp', ['ngRoute', 'ngAria']);
    angular.module('tcp').value('wikipedia', wikipedia);
    angular.module('tcp').value('extract', extract);
    angular.module('tcp').value('lodash', _);
    angular.module('tcp').value('highlighter', highlighter);
    angular.module('tcp').value('google', google);
    angular.module('tcp').value('utils', utils);
    angular.module('tcp').value('store', store);
    angular.module('tcp').value('postStore', store.child('post'));
    angular.module('tcp').value('userStore', store.child('user'));
    angular.module('tcp').value('companyStore', store.child('company'));
    angular.module('tcp').value('tagStore', store.child('tag'));

    if (!window.DEBUGGING) {
        angular.module('tcp').config(['$compileProvider', function ($compileProvider) {
              $compileProvider.debugInfoEnabled(false);
        }]);
    }
})();
