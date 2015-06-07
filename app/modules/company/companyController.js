angular.module('tcp').controller('companyController', [
    '$scope',
    'wikipedia',
    'utils',
    function ($scope, wikipedia, utils) {
        'use strict';

        $scope.company = {};
        $scope.loading = false;
        $scope.editing = true;

        $scope.fetchCompanyInformation = function () {
            var has_desc, has_logo;

            $scope.loading = true;
            $scope.company.logo = null;
            $scope.company.description = null;

            wikipedia.extract($scope.name).then(function (page) {
                $scope.company.description = page && page.extract ?
                    page.extract.replace('\n', '\n\n') : '';

                has_desc = true;
                $scope.loading = !(has_desc && has_logo);
                $scope.$apply();
            });

            google.images($scope.name + ' company logo').then(function (res) {
                var logo = res && res.responseData && res.responseData.results ?
                    res.responseData.results[0].url : '';

                if (!logo) {
                    return;
                }

                utils.preload(logo, function () {
                    has_logo = true;
                    $scope.company.logo = logo;
                    $scope.loading = !(has_desc && has_logo);
                    $scope.$apply();
                });
            });
        };

        $scope.edit = function () {
            $scope.editing = true;
        };

        $scope.save = function () {
            $scope.editing = false;
        };

        // XXX - remove once done testing
        $scope.name = 'Hormel';
        $scope.fetchCompanyInformation();
    }
]);
