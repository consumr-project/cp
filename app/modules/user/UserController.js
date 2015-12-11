angular.module('tcp').controller('UserController', [
    '$scope',
    '$routeParams',
    'NavigationService',
    'ServicesService',
    'utils',
    'i18n',
    function ($scope, $routeParams, NavigationService, ServicesService, utils, i18n) {
        'use strict';

        $scope.user = {};
        $scope.i18n = i18n;

        $scope.vm = {
            id: $routeParams.id
        };

        /**
         * @param {String} id
         * @return {Promise}
         */
        $scope.load = function (id) {
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
    }
]);
