angular.module('tcp').controller('companyController', [
    '$scope',
    '$routeParams',
    'NavigationService',
    'Auth',
    'utils',
    'wikipedia',
    'companies',
    'logger',
    function ($scope, $routeParams, NavigationService, Auth, utils, wikipedia, companies, logger) {
        'use strict';

        var log = logger('company');

        $scope.company = {};
        $scope.error = null;
        $scope.existing = !!$routeParams.guid;
        $scope.vm = { add_event: {} };

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

            $scope.vm.fetchingCompanySummary = true;

            // XXX error state
            wikipedia.extract(name).then(function (extract) {
                $scope.vm.fetchingCompanySummary = false;
                $scope.company.summary = extract.extract_no_refs;
                normalizeCompany();
                $scope.$apply();
            });
        }

        /**
         * @param {String} id
         * @return {Promise}
         */
        function load(id) {
            return companies.get(id).then(function (company) {
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
            NavigationService.company(guid);
            $scope.$apply();
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

            companies.put($scope.company, ['name', 'summary', 'image', 'guid'])
                .then(saveSuccessHandler)
                .catch(saveErrorHandler);
        };

        $scope.companyPage = function () {
            if ($routeParams.guid) {
                load($routeParams.guid);
            } else {
                $scope.$watch('company.name', fetchCompanySummary);
            }
        };

        $scope.loadCompany = function (id) {
            load(id);
        };

        $scope.gotoCompany = function (id) {
            NavigationService.company(id);
        };
    }
]);
