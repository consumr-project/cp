angular.module('tcp').directive('user', [
    'NavigationService',
    'ServicesService',
    'utils',
    'i18n',
    function (NavigationService, ServicesService, utils, i18n) {
        'use strict';

        function controller($scope) {
            $scope.user = {};
            $scope.i18n = i18n;

            /**
             * @param {String} id
             * @return {Promise}
             */
            function load(id) {
                return ServicesService.query.users.retrieve(id).then(function (user) {
                    $scope.user = user;
                    $scope.user.$summary = utils.summaryze(user.summary);
                    $scope.user.$followers_count = 0;
                    $scope.user.$following_count = 0;
                });
            }

            $scope.onStartFollowing = function () {
                $scope.user.$followers_count++;
            };

            if ($scope.id) {
                load($scope.id);
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            templateUrl: '/app/components/user/user.html',
            scope: {
                id: '@'
            }
        };
    }
]);
