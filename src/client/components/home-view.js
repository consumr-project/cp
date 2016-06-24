angular.module('tcp').directive('homeView', [
    function () {
        'use strict';

        function controller($scope, $window) {
            $scope.im_cool = function () {
                $window.alert('ok, thanks for being cool but I\'m going to ' +
                    'need you to be cool in like three more weeks when ' +
                    'this feature is done.');
            };
        }

        return {
            replace: true,
            controller: ['$scope', '$window', controller],
            template: function () {
                return [
                    '<div class="home-view-component">',
                    '    <div class="banner">',
                    '        <div class="site-content center-align">',
                    '            <search form="true"></search>',
                    '            <p i18n="common/intro"></p>',
                    '        </div>',
                    '    </div>',

                    '    <section class="margin-top-large">',
                    '        <div class="snav__item snav__item--active margin-left-xlarge" i18n="home/trending"></div>',
                    '        <hr>',

                    '        <trending></trending>',

                    '        <div class="home-view-component__coooool">',
                    '            <p i18n="home/have_a_sec"></p>',
                    '            <p i18n="home/do_something_cool"></p>',
                    '            <button ng-click="im_cool()" i18n="home/im_cool"></button>',
                    '        </div>',
                    '    </section>',
                    '</div>',
                ].join('');
            },
        };
    }
]);
