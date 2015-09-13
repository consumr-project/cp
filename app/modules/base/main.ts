/// <reference path="../../../typings/firebase/firebase.d.ts"/>
/// <reference path="../../../typings/moment/moment.d.ts"/>
/// <reference path="../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../../typings/tcp.d.ts"/>
/// <reference path="../../../typings/i18n.d.ts"/>
/// <reference path="../../../typings/lodash/lodash.d.ts"/>

import * as _ from 'lodash';
import * as utils from '../../services/utils';
import * as wikipedia from '../../services/wikipedia';
import * as extract from '../../services/extract';

declare var entity: Object;
declare var highlighter: Object;

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
        .value('extract', extract)
        .value('highlighter', highlighter) // global
        .value('i18n', i18n) // global
        .value('lodash', _) //global
        .value('moment', moment) // global
        .value('store', store)
        .value('userStore', store.child('user'))
        .value('utils', utils)
        .value('wikipedia', wikipedia);

    angular.module('tcp').config([
        '$routeProvider',
        '$locationProvider',
        '$compileProvider',
        function ($routeProvider, $locationProvider, $compileProvider) {
            $locationProvider.html5Mode(true);
            $compileProvider.debugInfoEnabled(DEBUGGING);

            if (DEBUGGING) {
                $routeProvider.when('/guide', {
                    templateUrl: '/app/modules/dev/index.html',
                    controller: 'guideController'
                });
            }

            $routeProvider.when('/', {
                templateUrl: '/app/modules/home/index.html',
                controller: 'homeController'
            });

            $routeProvider.when('/user/:guid', {
                templateUrl: '/app/modules/user/index.html',
                controller: 'userController'
            });

            $routeProvider.when('/company/:guid?', {
                templateUrl: '/app/modules/company/index.html',
                controller: 'companyController'
            });

            $routeProvider.when('/company/:companyGuid/entry/:guid?', {
                templateUrl: '/app/modules/entry/index.html',
                controller: 'entryController'
            });

            $routeProvider.otherwise({
                templateUrl: '/app/modules/base/404.html',
            });
        }
    ]);
}
