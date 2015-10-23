angular.module('tcp').controller('navigationController', [
    '$rootScope',
    '$scope',
    '$location',
    'Auth',
    'utils',
    function ($rootScope, $scope, $location, Auth, utils) {
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
        function state(base, additional) {
            return function () {
                var args = [base];

                if (additional) {
                    args.push(additional());
                }

                utils.state.apply(null, args);
            }
        }

        $scope.nav = {
            home: state(''),
            company: state('company'),
            profile: state('user', function () { return Auth.USER.uid })
        };

        $rootScope.$on('$locationChangeStart', function () {
            $scope.nav.search = {
                active: activeSearch(),
                included: includeSearch()
            };
        });
    }
]);
