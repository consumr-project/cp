angular.module('tcp').directive('user', [
    'Services',
    'Session',
    'utils',
    function (Services, Session, utils) {
        'use strict';

        var STAT_CONTRIBUTIONS = {},
            STAT_FOLLOWING = {},
            STAT_FOLLOWERS = {},
            STAT_FAVORITES = {};

        function controller($scope) {
            $scope.STAT_CONTRIBUTIONS = STAT_CONTRIBUTIONS;
            $scope.STAT_FAVORITES = STAT_FAVORITES;
            $scope.STAT_FOLLOWERS = STAT_FOLLOWERS;
            $scope.STAT_FOLLOWING = STAT_FOLLOWING;

            $scope.vm = {
                stats: null,
                cur_stat: null,
                followed_by_me: null,
            };

            /**
             * @param {String} id
             * @return {Promise}
             */
            function load(id) {
                return Services.query.users.retrieve(id, ['followers']).then(function (user) {
                    $scope.vm.user = user;
                    $scope.vm.followed_by_me = user.followers['@meta'].instead.includes_me;

                    Services.query.users.stats(id)
                        .then(utils.scope.set($scope, 'vm.stats'))
                        .then(utils.scope.set($scope, 'vm.cur_stat', STAT_CONTRIBUTIONS));
                });
            }

            /**
             * what can be done in this page?
             */
            function update_actionable_items() {
                $scope.vm.loggedin = !!Session.USER.id;
                $scope.vm.myself = $scope.id === Session.USER.id;
            }

            /**
             * @param {String} user_id
             * @return {Promise}
             */
            $scope.on_start_following = function (user_id) {
                utils.assert(user_id);
                utils.assert(Session.USER, 'must be logged in');
                utils.assert(Session.USER.id, 'must be logged in');

                return Services.query.users.followers.upsert(user_id, {
                    user_id: Session.USER.id
                }).then(utils.scope.set($scope, 'vm.followed_by_me', true));
            };

            /**
             * @param {String} user_id
             * @return {Promise}
             */
            $scope.on_stop_following = function (user_id) {
                utils.assert(user_id);
                utils.assert(Session.USER, 'must be logged in');
                utils.assert(Session.USER.id, 'must be logged in');

                return Services.query.users.followers.delete(user_id, Session.USER.id)
                    .then(utils.scope.set($scope, 'vm.followed_by_me', false));
            };

            $scope.load_stat = function (stat) {
                $scope.vm.cur_stat = stat;
            };

            if ($scope.id) {
                update_actionable_items();
                load($scope.id);
            }

            Session.on(Session.EVENT.LOGIN, update_actionable_items);
            Session.on(Session.EVENT.LOGOUT, update_actionable_items);
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                id: '@'
            },
            template: [
                '<div>',
                '    <center ng-if="vm.user.id" class="margin-top-large">',
                '        <avatar class="avatar--block"',
                '            title="{{::vm.user.title}}" name="{{::vm.user.name}}"',
                '            email="{{::vm.user.email}}"></avatar>',

                '        <p class="uppercase" i18n="user/member_number"',
                '            data="{num: vm.user.member_number}"></p>',

                '        <div ng-invisible="vm.myself || !vm.loggedin"',
                '            class="block margin-top-xlarge margin-bottom-xlarge">',
                '            <button class="button--unselected"',
                '                ng-click="on_start_following(vm.user.id)"',
                '                ng-if="vm.followed_by_me === false"',
                '                i18n="admin/follow"></button>',
                '            <button',
                '                ng-click="on_stop_following(vm.user.id)"',
                '                ng-if="vm.followed_by_me === true"',
                '                i18n="admin/unfollow"></button>',
                '        </div>',

                '        <section ng-if="vm.stats">',
                '            <div class="snav">',
                '                <div class="snav__item" ng-click="load_stat(STAT_CONTRIBUTIONS)" i18n="user/contributions" data="{count: vm.stats.contributions}"></div>',
                '                <div class="snav__item" ng-click="load_stat(STAT_FOLLOWING)" i18n="user/following" data="{count: vm.stats.following}"></div>',
                '                <div class="snav__item" ng-click="load_stat(STAT_FOLLOWERS)" i18n="user/followers" data="{count: vm.stats.followers}"></div>',
                '                <div class="snav__item" ng-click="load_stat(STAT_FAVORITES)" i18n="user/favorites" data="{count: vm.stats.favorites}"></div>',
                '            </div>',

                '            <div class="snav" ng-show="vm.cur_stat === STAT_CONTRIBUTIONS">',
                '                <div class="snav__item" i18n="user/contributions_events" data="{count: vm.stats.contributions_events}"></div>',
                '                <div class="snav__item" i18n="user/contributions_questions" data="{count: vm.stats.contributions_questions}"></div>',
                '                <div class="snav__item" i18n="user/contributions_companies" data="{count: vm.stats.contributions_companies}"></div>',
                '                <div class="snav__item" i18n="user/contributions_reviews" data="{count: vm.stats.contributions_reviews}"></div>',
                '                <div class="snav__item" i18n="user/contributions_sources" data="{count: vm.stats.contributions_sources}"></div>',
                '            </div>',

                '            <div class="snav" ng-show="vm.cur_stat === STAT_FOLLOWING">',
                '                <div class="snav__item" i18n="user/following_companies" data="{count: vm.stats.following_companies}"></div>',
                '                <div class="snav__item" i18n="user/following_users" data="{count: vm.stats.following_users}"></div>',
                '                <div class="snav__item" i18n="user/following_tags" data="{count: vm.stats.following_tags}"></div>',
                '            </div>',
                '        </section>',
                '    </center>',
                '</div>'
            ].join('')
        };
    }
]);
