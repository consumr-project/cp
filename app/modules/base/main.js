/* global TCP_BUILD_CONFIG, Firebase, wikipedia, extract, _, highlighter, google, utils, entity, i18n */
(function () {
    'use strict';

    var store = new Firebase(TCP_BUILD_CONFIG.firebase.url),
        deps = ['ngRoute', 'ngAria'];

    if (window.DEBUGGING) {
        deps.push('rector');
    }

    angular.module('tcp', deps);

    angular.module('tcp').constant('DEBUGGING', !!window.DEBUGGING);
    angular.module('tcp').constant('CONFIG', TCP_BUILD_CONFIG);

    angular.module('tcp').value('companyStore', store.child('company'));
    angular.module('tcp').value('entity', entity);
    angular.module('tcp').value('extract', extract);
    angular.module('tcp').value('highlighter', highlighter);
    angular.module('tcp').value('i18n', i18n);
    angular.module('tcp').value('lodash', _);
    angular.module('tcp').value('store', store);
    angular.module('tcp').value('userStore', store.child('user'));
    angular.module('tcp').value('utils', utils);
    angular.module('tcp').value('wikipedia', wikipedia);

    if (!window.DEBUGGING) {
        angular.module('tcp').config(['$compileProvider', function ($compileProvider) {
              $compileProvider.debugInfoEnabled(false);
        }]);
    }
})();
