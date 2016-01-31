angular.module('tcp').controller('NavigationController', [
    '$rootScope',
    '$scope',
    'SessionService',
    'NavigationService',
    function ($rootScope, $scope, SessionService, NavigationService) {
        'use strict';

        $scope.nav = {
            home: NavigationService.home,
            search: NavigationService.search,
            company: NavigationService.company,
            notifications: NavigationService.notifications,
            profile: NavigationService.user_me,
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
