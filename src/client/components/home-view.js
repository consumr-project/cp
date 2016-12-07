angular.module('tcp').directive('homeView', [
    'Session',
    'Navigation',
    function (Session, Navigation) {
        'use strict';

        function controller($scope) {
            $scope.vm = {
                selected: Session.USER && Session.USER.id ? 'mine' : 'trending',

                TYPE_MINE: 'mine',
                TYPE_TRENDING: 'trending',
            };

            $scope.im_cool = function () {
                Navigation.help_us_out();
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: function () {
                return [
                    '<div class="home-view-component">',
                        '<div class="banner">',
                            '<div class="site-content center-align">',
                                '<search redirects="true"></search>',
                                '<p i18n="common/intro"></p>',
                            '</div>',
                        '</div>',

                        '<section class="margin-top-xsmall home-view-component__wrapper">',
                            '<snav class="snav--borderless" value="vm.selected">',
                                '<snav-item ng-click="vm.selected = vm.TYPE_TRENDING" ',
                                    'value="{{vm.TYPE_TRENDING}}" ',
                                    'class="margin-left-xlarge" ',
                                    'i18n="home/trending"></snav-item>',
                                '<snav-item ng-click="vm.selected = vm.TYPE_MINE" ',
                                    'value="{{vm.TYPE_MINE}}" ',
                                    'class="logged-in-only--display" ',
                                    'i18n="home/your_stuff"></snav-item>',
                            '</snav>',

                            '<hr>',

                            '<trending ng-if="vm.selected === vm.TYPE_TRENDING" type="trending"></trending>',
                            '<trending ng-if="vm.selected === vm.TYPE_MINE" type="mine"></trending>',

                            '<div class="home-view-component__coooool">',
                                '<p i18n="home/have_a_sec"></p>',
                                '<p i18n="home/do_something_cool"></p>',
                                '<button ng-click="im_cool()" i18n="home/im_cool"></button>',
                            '</div>',
                        '</section>',
                    '</div>',
                ].join('');
            },
        };
    }
]);
