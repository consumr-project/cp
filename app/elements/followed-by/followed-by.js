angular.module('tcp').directive('followedBy', [
    'i18n',
    'Auth',
    'lodash',
    function (i18n, Auth, _) {
        'use strict';

        /**
         * @param {String[]} users ids
         * @param {String} current user id
         * @return {Boolean}
         */
        function includesUser(users, current) {
            return _.contains(users, current);
        }

        /**
         * @param {String[]} users ids
         * @param {String} current user id
         * @return {Boolean}
         */
        function includesUserAndOthers(users, current) {
            return users.length > 1 && includesUser(users, current);
        }

        /**
         * @param {String[]} users ids
         * @return {Boolean}
         */
        function includesOthers(users) {
            return !!users.length;
        }

        /**
         * @param {Sring} key for pages namespace
         * @param {String[]} [users] user ids
         * @return {String}
         */
        function str(key, users) {
            var count = users ? users.length : 0;

            return i18n.get('pages/' + key, {
                count: count,
                countMinusOne: count - 1
            });
        }

        /**
         * @param {String[]} users ids
         * @param {String} current user id
         * @return {String}
         */
        function getMessage(users, user) {
            var message = '';

            switch (true) {
                case includesUserAndOthers(users, user):
                    message = str('followed_by_you_and_others', users);
                    break;

                case includesUser(users, user):
                    message = str('followed_by_you');
                    break;

                case includesOthers(users):
                    message = str('followed_by_others', users);
                    break;

                default:
                    message = str('followed_by_none');
                    break;
            }

            return message;
        }

        function controller($scope) {
            Auth.on(Auth.EVENT.LOGIN, update);
            Auth.on(Auth.EVENT.LOGOUT, update);
            $scope.$watchCollection('users', update);

            $scope.onClick = function () {
                if (includesUser(getUsers(), getUid())) {
                    $scope.onStopFollowing();
                } else {
                    $scope.onStartFollowing();
                }
            };

            function update() {
                $scope.message = getMessage(getUsers(), getUid());
            }

            function getUsers() {
                return $scope.users || [];
            }

            function getUid() {
                return Auth.USER && Auth.USER.uid;
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],

            scope: {
                onStartFollowing: '&',
                onStopFollowing: '&',
                users: '='
            },

            template: [
                '<div class="followed-by is-non-selectable">',
                    '<span ng-click="onClick()">{{message}}</span>',
                '</div>'
            ].join('')
        };
    }
]);
