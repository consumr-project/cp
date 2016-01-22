angular.module('tcp').directive('user', [
    'ServicesService',
    'SessionService',
    'utils',
    function (ServicesService, SessionService, utils) {
        'use strict';

        function controller($scope) {
            $scope.vm = {};
            $scope.user = {};

            /**
             * @param {String} id
             * @return {Promise}
             */
            function load(id) {
                return ServicesService.query.users.retrieve(id).then(function (user) {
                    $scope.user = user;
                    $scope.user.$summary = utils.summaryze(user.summary || '');
                    $scope.user.$followers_count = 0;
                    $scope.user.$following_count = 0;
                });
            }

            /**
             * what can be done in this page?
             */
            function update_actionable_items() {
                $scope.vm.loggedin = !!SessionService.USER.id;
                $scope.vm.myself = $scope.id === SessionService.USER.id;
            }

            /**
             * @return {void}
             */
            $scope.on_start_following = function () {
                $scope.user.$followers_count++;
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

            SessionService.on(SessionService.EVENT.LOGIN, update_actionable_items);
            SessionService.on(SessionService.EVENT.LOGOUT, update_actionable_items);
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
                '        <avatar class="avatar--block" summary="{{::user.$summary}}"',
                '          title="{{::user.title}}" name="{{::user.name}}"',
                '          image="{{::user.avatar_url}}"></avatar>',

                '        <div class="block">',
                '            <button ng-click="on_start_following()"',
                '              ng-invisible="vm.myself || !vm.loggedin"',
                '              class="margin-top-xlarge margin-bottom-xlarge"',
                '              i18n="admin/follow"></button>',
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
                '                    <a ng-if="::user.linkedin_url" href="{{::user.linkedin_url}}" target="_blank">',
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
