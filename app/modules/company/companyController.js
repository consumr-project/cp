angular.module('tcp').controller('companyController', [
    '$scope',
    '$routeParams',
    'wikipedia',
    'utils',
    'entity',
    'companyStore',
    function ($scope, $routeParams, wikipedia, utils, entity, companyStore) {
        'use strict';

        $scope.company = {};
        $scope.loading = false;
        $scope.editing = false;
        $scope.changed = false;

        /**
         * @param {Function} [callback]
         */
        function getExtract(callback) {
            callback = utils.opCallback(callback);

            wikipedia.extract($scope.company.name).then(function (page) {
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

            wikipedia.image($scope.company.name).then(function (logo) {
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
            if (!$scope.changed) {
                return;
            }

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
            if (!$scope.changed) {
                $scope.editing = false;
                return;
            }

            $scope.loading = true;
            entity.upsert(companyStore, $scope.company).then(function () {
                utils.state('company', $scope.company.guid);
                $scope.loading = false;
                $scope.editing = false;
                $scope.changed = false;
                $scope.$apply();
            });
        };

        $scope.initialize = function () {
            if (!$routeParams.guid) {
                $scope.editing = true;
                return;
            }

            $scope.loading = true;
            entity.get(companyStore, $routeParams.guid).then(function (company) {
                $scope.company = company;
                $scope.loading = false;
                $scope.$apply();
            });
        };
    }
]);
