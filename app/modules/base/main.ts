/// <reference path="../../../typings/firebase/firebase.d.ts"/>
/// <reference path="../../../typings/moment/moment.d.ts"/>
/// <reference path="../../../typings/angularjs/angular.d.ts"/>

import * as utils from '../../services/utils';

declare var TCP_BUILD_CONFIG: {
    firebase: { url: string; };
};

module tcp {
    const DEBUGGING: Boolean = (<any>window).DEBUGGING;

    var store: Firebase = new Firebase(TCP_BUILD_CONFIG.firebase.url),
        deps: Array<string> = ['ngRoute', 'ngAria'];

    if (DEBUGGING) {
        deps.push('rector');
    }

    moment.locale(navigator.userLanguage || navigator.language);
    angular.module('tcp', deps);

    angular.module('tcp')
        .constant('DEBUGGING', DEBUGGING)
        .constant('CONFIG', TCP_BUILD_CONFIG);

    angular.module('tcp')
        .value('companyStore', store.child('company'))
        .value('entity', entity) // global
        .value('extract', extract) // global
        .value('highlighter', highlighter) // global
        .value('i18n', i18n) // global
        .value('lodash', _) // global
        .value('moment', moment) // global
        .value('store', store)
        .value('userStore', store.child('user'))
        .value('utils', utils)
        .value('wikipedia', wikipedia); // global

    if (!DEBUGGING) {
        angular.module('tcp').config(['$compileProvider', function ($compileProvider) {
              $compileProvider.debugInfoEnabled(false);
        }]);
    }
}
