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

        $scope.company = {
            $followed_by: [],
            $loaded: false,
            $summary_parts: []
            id: null,
            name: null,
            summary: null
        };

        $scope.vm = {
            id: $routeParams.id,
            existing: !!$routeParams.id,
            add_event: {}
        };

        /**
         * @return {Promise}
         */
        $scope.save = function () {
            utils.assert(Auth.USER, 'login required for action');
            utils.assert($scope.company.name, 'company name is required');

            return ServicesService.query.companies.create(get_company()).then(function (res) {
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
                $scope.$watch('company.name', get_summary);
            }
        };

        /**
         * @param {String} [id]
         * @return {Promise}
         */
        $scope.load = function (id) {
            return ServicesService.query.companies.retrieve(id || $routeParams.id)
                .then(utils.pluck('data'))
                .then(utils.scope.not_found($scope))
                .then(normalize_company)
                .then(utils.scope.set($scope, 'company'));
        };

        /**
         * @return {Promise}
         */
        $scope.loadFollowers = function () {
            utils.assert($routeParams.id);

            return ServicesService.query.companies.followers.retrieve($routeParams.id)
                .then(utils.pluck('data'))
                .then(utils.scope.set($scope, 'company.$followed_by'));
        };

        /**
         * @return {Promise}
         */
        $scope.onStartFollowing = function () {
            utils.assert($routeParams.id);
            utils.assert(Auth.USER);

            return ServicesService.query.companies.followers.create($routeParams.id, { user_id: Auth.USER.id })
                .then($scope.loadFollowers);
        };

        /**
         * @return {Promise}
         */
        $scope.onStopFollowing = function () {
            utils.assert($routeParams.id);
            utils.assert(Auth.USER);

            return ServicesService.query.companies.followers.delete($routeParams.id, Auth.USER.id)
                .then($scope.load.bind(null, $routeParams.id));
        };

        /**
         * @param {Company} company
         * @return {Company}
         */
        function normalize_company(company) {
            utils.assert(company);

            company.$followed_by = company.$followed_by || [];
            company.$loaded = true;
            company.$summary_parts = !company.summary ? [] :
                company.summary.split('\n');

            return company;
        }

        /**
         * @param {String} name of company
         * @return {Promise}
         */
        function get_summary(name) {
            utils.assert(name);

            // XXX error state
            $scope.vm.fetching_company_summary = true;
            wikipedia.extract(name).then(function (extract) {
                $scope.vm.fetching_company_summary = false;
                $scope.company.name = extract.title;
                $scope.company.summary = extract.extract_no_refs;
                normalize_company($scope.company);
                $scope.$apply();
            });
        }

        /**
         * @return {Company}
         */
        function get_company() {
            return {
                id: $scope.company.id || ServicesService.query.UUID,
                name: $scope.company.name,
                summary: $scope.company.summary,
                created_by: Auth.USER.id,
                updated_by: Auth.USER.id,
            };
        }
    }
]);
