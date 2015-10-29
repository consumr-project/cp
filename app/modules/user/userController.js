angular.module('tcp').controller('userController', [
    '$scope',
    '$routeParams',
    'NavigationService',
    'users',
    'utils',
    'i18n',
    function ($scope, $routeParams, NavigationService, users, utils, i18n) {
        'use strict';

        $scope.user = {};
        $scope.i18n = i18n;

        /**
         * @param {String} id
         * @return {Promise}
         */
        function load(id) {
            return users.get(id).then(function (user) {
                $scope.user = user;
                $scope.user.shortSummary = utils.summaryze(user.summary);
                $scope.$apply();
            });
        }

        $scope.userPage = function () {
            load($routeParams.guid);
        };

        $scope.loadUser = function (id) {
            load(id);
        };

        $scope.gotoUser = function (id) {
            NavigationService.user(id);
        };

        if ($routeParams.guid) {
            $scope.userPage();
        }
    }
]);
