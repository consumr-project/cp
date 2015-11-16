angular.module('tcp').controller('NavigationController', [
    '$rootScope',
    '$scope',
    'Auth',
    'NavigationService',
    function ($rootScope, $scope, Auth, NavigationService) {
        'use strict';

        $scope.nav = {
            home: NavigationService.home,
            search: NavigationService.search,
            company: NavigationService.company,
            profile: function () { NavigationService.user(Auth.USER.uid); }
        };

        $rootScope.$on('$locationChangeStart', function () {
            $scope.nav.search.active = NavigationService.oneOf([
                NavigationService.BASES.SEARCH
            ]);

            $scope.nav.search.included = NavigationService.oneOf([
                NavigationService.BASES.HOME,
                NavigationService.BASES.SEARCH
            ]);
        });
    }
]);
