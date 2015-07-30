angular.module('tcp').controller('companyController', [
    '$scope',
    '$routeParams',
    'wikipedia',
    function ($scope, $routeParams, wikipedia) {
        'use strict';

        $scope.company = {};

        $scope.$watch('company.name', function (name) {
            if (!name) {
                return;
            }

            wikipedia.extract(name).then(function (extract) {
                $scope.company.description = extract.extract_no_refs;
                $scope.company.$descriptionParts = extract.extract_no_ref_parts;
                $scope.$apply();
            });
        });

        $scope.company.name = 'Trader Joe\'s';
    }
]);
