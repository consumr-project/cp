angular.module('tcp').controller('companyController', [
    '$scope',
    '$routeParams',
    'Auth',
    'utils',
    'wikipedia',
    'companyStore',
    'entity',
    'logger',
    function ($scope, $routeParams, Auth, utils, wikipedia, companyStore, entity, logger) {
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
            return wikipedia.extract(name).then(function (extract) {
                $scope.company.summary = extract.extract_no_refs;
                normalizeCompany();
                $scope.$apply();
            });
        }

        function loadCompanyInformation() {
            entity.get(companyStore, $routeParams.guid).then(function (ref) {
                $scope.company = ref.val();
                normalizeCompany();

                if (!$scope.company) {
                    $scope.error = 'company not found';
                }

                $scope.$apply();
            });
        }

        function saveSuccessHandler() {
            var guid = $scope.company.guid;
            utils.state(companyStore.key(), guid);
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
                $scope.company.guid = utils.semiguid($scope.company.name);
            }

            entity.put(companyStore, $scope.company, ['name', 'summary'])
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
