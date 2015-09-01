/* global TCP_BUILD_CONFIG, Firebase, wikipedia, extract, _, highlighter, google, utils, entity, i18n, moment */
(function () {
    'use strict';

    var store = new Firebase(TCP_BUILD_CONFIG.firebase.url),
        deps = ['ngRoute', 'ngAria'];

    if (window.DEBUGGING) {
        deps.push('rector');
    }

    moment.locale(navigator.userLanguage || navigator.language);
    angular.module('tcp', deps);

    angular.module('tcp')
        .constant('DEBUGGING', !!window.DEBUGGING)
        .constant('CONFIG', TCP_BUILD_CONFIG);

    angular.module('tcp')
        .value('companyStore', store.child('company'))
        .value('entity', entity)
        .value('extract', extract)
        .value('highlighter', highlighter)
        .value('i18n', i18n)
        .value('lodash', _)
        .value('moment', moment)
        .value('store', store)
        .value('userStore', store.child('user'))
        .value('utils', utils)
        .value('wikipedia', wikipedia);

    if (!window.DEBUGGING) {
        angular.module('tcp').config(['$compileProvider', function ($compileProvider) {
              $compileProvider.debugInfoEnabled(false);
        }]);
    }
})();
