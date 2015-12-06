angular.module('tcp').controller('CompanyController', [
    '$scope',
    '$routeParams',
    'NavigationService',
    'ServicesService',
    'Auth',
    'utils',
    'wikipedia',
    'logger',
    function (
        $scope,
        $routeParams,
        NavigationService,
        ServicesService,
        Auth,
        utils,
        wikipedia,
        logger
    ) {
        'use strict';

        var log = logger('company');

        $scope.company = {};

        $scope.vm = {
            id: $routeParams.id,
            existing: !!$routeParams.id,
            add_event: {}
        };

        /**
         * @param {Company} company
         * @return {Company}
         */
        function normalize(company) {
            utils.assert(company);

            company.followedBy = company.followedBy || [];
            company.$loaded = true;
            company.$summaryParts = !company.summary ? [] :
                company.summary.split('\n');

            return company;
        }

        /**
         * @param {String} name of company
         * @return {Promise}
         */
        function getSummary(name) {
            utils.assert(name);

            // XXX error state
            $scope.vm.fetchingCompanySummary = true;
            wikipedia.extract(name).then(function (extract) {
                $scope.vm.fetchingCompanySummary = false;
                $scope.company.name = extract.title;
                $scope.company.summary = extract.extract_no_refs;
                normalize($scope.company);
                $scope.$apply();
            });
        }

        /**
         * @return {Promise}
         */
        $scope.save = function () {
            utils.assert(Auth.USER, 'login required for action');
            utils.assert($scope.company.name, 'company name is required');

            return ServicesService.query.companies.create({
                id: $scope.company.id || ServicesService.query.UUID,
                name: $scope.company.name,
                summary: $scope.company.summary,
                created_by: Auth.USER.id,
                updated_by: Auth.USER.id,
            }).then(function (res) {
                NavigationService.company(res.data.id);
                log('saved company', res.data.id);
                return res;
            });
        };

        /**
         * sets up watchers for new companies
         * @param {String} [id]
         */
        $scope.init = function (id) {
            if (!id) {
                $scope.$watch('company.name', getSummary);
            }
        };

        /**
         * @param {String} [id]
         * @return {Promise}
         */
        $scope.load = function (id) {
            return ServicesService.query.companies.retrieve(id || $routeParams.id)
                .then(utils.pluck('data'))
                .then(normalize)
                .then(utils.scope($scope, 'company'));
        };

        // /**
        //  * @param {String} id
        //  * @return {Promise}
        //  */
        // function load(id) {
        //     return companies.get(id).then(function (company) {
        //         $scope.company = company;
        //         // $scope.company.$loaded = true;
        //         normalizeCompany();
        //
        //         if (!$scope.company) {
        //             log.error('company not found');
        //         }
        //
        //         $scope.$apply();
        //     });
        // }

        // function saveSuccessHandler() {
        //     var id = $scope.company.id;
        //     NavigationService.company(id);
        //     $scope.$apply();
        //     log('saved', id);
        // }

        // function saveErrorHandler(err) {
        //     log.error('save error', err);
        // }

        // $scope.onStopFollowing = function () {
        //     if (!Auth.USER) {
        //         log.error('you must be logged in to follow companies');
        //         return;
        //     }
        //
        //     if (_.contains($scope.company.followedBy, Auth.USER.uid)) {
        //         $scope.company.followedBy = _.without($scope.company.followedBy, Auth.USER.uid);
        //         companies.store.child($scope.company.guid).child('followedBy')
        //             .set($scope.company.followedBy);
        //     }
        // };
        //
        // $scope.onStartFollowing = function () {
        //     if (!Auth.USER) {
        //         log.error('you must be logged in to follow companies');
        //         return;
        //     }
        //
        //     if (!_.contains($scope.company.followedBy, Auth.USER.uid)) {
        //         $scope.company.followedBy.push(Auth.USER.uid);
        //         companies.store.child($scope.company.guid).child('followedBy')
        //             .set($scope.company.followedBy);
        //     }
        // };

        // $scope.loadCompany = function (id) {
        //     load(id);
        // };
        //
        // $scope.gotoCompany = function (id) {
        //     NavigationService.company(id);
        // };
    }
]);
