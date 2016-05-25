angular.module('tcp').directive('user', [
    'Services',
    'Session',
    'utils',
    function (Services, Session, utils) {
        'use strict';

        function controller($scope) {
            $scope.user = {};

            $scope.vm = {
                followed_by_me: null,
            };

            /**
             * @param {String} id
             * @return {Promise}
             */
            function load(id) {
                return Services.query.users.retrieve(id).then(function (user) {
                    $scope.user = user;
                    $scope.user.$summary = utils.summaryze(user.summary || '');
                    $scope.user.$followers_count = 0;
                    $scope.user.$following_count = 0;
                    $scope.vm.followed_by_me = false;
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
            };

            /**
             * @param {String} user_id
             * @return {Promise}
             */
            $scope.on_stop_following = function (user_id) {
                utils.assert(user_id);
                utils.assert(Session.USER, 'must be logged in');
                utils.assert(Session.USER.id, 'must be logged in');
            };

            /**
             * @param {User} user
             * @return {Boolean}
             */
            $scope.is_elsewhere = function (user) {
                return !!user.linkedin_url;
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
                '    <center ng-if="user.id" class="margin-top-large animated fadeIn">',
                '        <avatar class="avatar--block"',
                '            title="{{::user.title}}" name="{{::user.name}}"',
                '            email="{{::user.email}}"></avatar>',

                '        <p class="uppercase" i18n="user/member_number"',
                '            data="{num: user.member_number}"></p>',

                '        <div ng-invisible="xxx.vm.myself || !vm.loggedin"',
                '            class="block margin-top-xlarge margin-bottom-xlarge">',
                '            <button class="button--unselected"',
                '                ng-click="on_start_following(user.id)"',
                '                ng-if="vm.followed_by_me === false"',
                '                i18n="admin/follow"></button>',
                '            <button',
                '                ng-click="on_stop_following(user.id)"',
                '                ng-if="vm.followed_by_me === true"',
                '                i18n="admin/unfollow"></button>',
                '        </div>',

                '        <table class="table--content center-align">',
                '            <tr>',
                '                <th i18n="user/following"></th>',
                '                <th i18n="user/followers"></th>',
                '                <th i18n="user/elsewhere" ng-if="::is_elsewhere(user)"></th>',
                '            </tr>',
                '            <tr>',
                '                <td ng-if="!user.$following_count" i18n="common/none"></td>',
                '                <td ng-if="user.$following_count">{{user.$followers_count}}</td>',
                '                <td ng-if="!user.$followers_count" i18n="common/none"></td>',
                '                <td ng-if="user.$followers_count">{{user.$followers_count}}</td>',
                '                <td ng-if="::is_elsewhere(user)">',
                '                    <a ng-if="::user.linkedin_url" href="{{::user.linkedin_url}}" target="_blank" rel="noreferrer">',
                '                        <img alt="" src="/assets/images/linkedin.png" style="height: 20px; width: 20px" />',
                '                    </a>',
                '                </td>',
                '            </tr>',
                '        </table>',
                '    </center>',
                '</div>'
            ].join('')
        };
    }
]);
