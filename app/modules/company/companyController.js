angular.module('tcp').controller('companyController', [
    '$scope',
    'wikipedia',
    'google',
    'utils',
    function ($scope, wikipedia, google, utils) {
        'use strict';

        $scope.company = {};
        $scope.loading = false;
        $scope.editing = true;

        /**
         * @param {Function} [callback]
         */
        function getExtract(callback) {
            callback = utils.opCallback(callback);

            wikipedia.extract($scope.name).then(function (page) {
                $scope.company.description = page && page.extract_no_refs ?
                    page.extract_no_refs.replace('\n', '\n\n') : '';

                callback();
                $scope.$apply();
            });
        }

        /**
         * @param {Function} [callback]
         */
        function getLogo(callback) {
            callback = utils.opCallback(callback);

            google.images($scope.name + ' company logo').then(function (res) {
                var logo = res && res.responseData && res.responseData.results ?
                    res.responseData.results[0].url : '';

                if (logo) {
                    utils.preload(logo, function () {
                        callback();
                        $scope.company.logo = logo;
                        $scope.$apply();
                    });
                } else {
                    callback();
                }
            });
        }

        $scope.fetchCompanyInformation = function () {
            $scope.loading = true;
            $scope.company.logo = null;
            $scope.company.description = null;

            getLogo(getExtract.bind(null, function () {
                $scope.loading = false;
            }));
        };

        $scope.edit = function () {
            $scope.editing = true;
        };

        $scope.save = function () {
            $scope.editing = false;
        };

        // XXX - remove once done testing
        $scope.name = 'Trader Joe\'s';
        $scope.fetchCompanyInformation();
    }
]);
