angular.module('tcp').controller('navigationController', [
    '$rootScope',
    '$scope',
    '$location',
    'Auth',
    function ($rootScope, $scope, $location, Auth) {
        'use strict';

        /**
         * include search bar in header?
         * @return {Boolean}
         */
        function includeSearch() {
            var path = $location.path().substr(1);
            return ['', 'search'].indexOf(path) !== -1;
        }

        /**
         * are we running a search right now?
         * @return {Boolean}
         */
        function activeSearch() {
            return $location.path().substr(1) === 'search';
        }

        /**
         * @param {String} base
         * @param {Function} [additional]
         * @return {Function}
         */
        function url(base, additional) {
            return function () {
                var args = [base];

                if (additional) {
                    args.push(additional());
                }

                $location.url(args.join('/'));
            }
        }

        $scope.nav = {
            home: url('/'),
            company: url('/company'),
            profile: url('/user', function () { return Auth.USER.uid })
        };

        $rootScope.$on('$locationChangeStart', function () {
            $scope.nav.search = {
                active: activeSearch(),
                included: includeSearch()
            };
        });
    }
]);
