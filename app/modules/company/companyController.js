angular.module('tcp').controller('companyController', [
    '$scope',
    '$routeParams',
    'Auth',
    'utils',
    'wikipedia',
    'companies',
    'entity',
    'logger',
    function ($scope, $routeParams, Auth, utils, wikipedia, companies, entity, logger) {
        'use strict';

        var log = logger('company');

        $scope.company = {};
        $scope.error = null;

        function normalizeCompany() {
            if (!$scope.company) {
                return;
            }

            $scope.company.$summaryParts = !$scope.company.summary ? [] :
                $scope.company.summary.split('\n');
        }

        /**
         * @param {String} name of company
         * @return {Promise}
         */
        function fetchCompanySummary(name) {
            if (!name) {
                return;
            }

            // XXX error state
            // XXX loading state
            wikipedia.image(name).then(function (image) {
                $scope.company.image = image;
                normalizeCompany();
                $scope.$apply();
            });

            // XXX error state
            // XXX loading state
            wikipedia.extract(name).then(function (extract) {
                $scope.company.summary = extract.extract_no_refs;
                normalizeCompany();
                $scope.$apply();
            });
        }

        function loadCompanyInformation() {
            companies.get($routeParams.guid).then(function (company) {
                $scope.company = company;
                normalizeCompany();

                if (!$scope.company) {
                    $scope.error = 'company not found';
                }

                $scope.$apply();
            });
        }

        function saveSuccessHandler() {
            var guid = $scope.company.guid;
            utils.state(companies.label, guid);
            log('saved', guid);
        }

        function saveErrorHandler(err) {
            $scope.error = 'there was an error saving this company, please try again.';
            log.error('save error', err);
        }

        $scope.save = function () {
            $scope.error = null;

            if (!Auth.USER) {
                $scope.error = 'you must be logged in to add or edit companies';
                log.info('login required for action');
                return;
            }

            if (!$scope.company.name) {
                $scope.error = 'a company name is required';
                log.info('company name is required');
                return;
            }

            // first save
            if (!$scope.company.guid) {
                $scope.company.guid = utils.simplify($scope.company.name);
            }

            companies.put($scope.company, ['name', 'summary', 'image'])
                .then(saveSuccessHandler)
                .catch(saveErrorHandler);
        };

        if (!$routeParams.guid) {
            $scope.$watch('company.name', fetchCompanySummary);
        } else {
            loadCompanyInformation();
        }
    }
]);
