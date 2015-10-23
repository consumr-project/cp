angular.module('tcp').controller('navigationController', [
    '$scope',
    'Auth',
    'utils',
    function ($scope, Auth, utils) {
        'use strict';

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
    }
]);
