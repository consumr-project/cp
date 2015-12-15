angular.module('tcp').directive('company', [
    'NavigationService',
    'ServicesService',
    'SessionService',
    'utils',
    function (
        NavigationService,
        ServicesService,
        SessionService,
        utils
    ) {
        'use strict';

        function controller($scope) {
            $scope.company = {
                $followed_by: [],
                $loaded: false,
                $summary_parts: [],
                id: null,
                name: null,
                summary: null
            };

            $scope.vm = {
                existing: !!$scope.id,
                add_event: {}
            };

            /**
             * sets up watchers for new companies
             * @param {String} [id]
             */
            function init(id) {
                $scope.$watch('company.name', get_summary);
            }

            /**
             * @param {String} [id]
             * @return {Promise}
             */
            function load(id) {
                return ServicesService.query.companies.retrieve(id || $scope.id)
                    .then(utils.scope.not_found($scope))
                    .then(normalize_company)
                    .then(utils.scope.set($scope, 'company'));
            }

            /**
             * @return {Promise}
             */
            $scope.save = function () {
                utils.assert(SessionService.USER, 'login required for action');
                utils.assert($scope.company.name, 'company name is required');

                return ServicesService.query.companies.create(get_company()).then(function (company) {
                    return $scope.onStartFollowing(company.id).then(function () {
                        NavigationService.company(company.id);
                        console.info('saved company', company.id);
                        return company;
                    });
                });
            };

            /**
             * @param {String} [company_id]
             * @return {Promise}
             */
            $scope.loadFollowers = function (company_id) {
                utils.assert($scope.id || company_id);

                return ServicesService.query.companies.followers.retrieve($scope.id || company_id)
                    .then(utils.scope.set($scope, 'company.$followed_by'));
            };

            /**
             * @param {String} [company_id]
             * @return {Promise}
             */
            $scope.onStartFollowing = function (company_id) {
                utils.assert($scope.id || company_id);
                utils.assert(SessionService.USER);

                return ServicesService.query.companies.followers.upsert($scope.id || company_id, {
                    user_id: SessionService.USER.id
                }).then($scope.loadFollowers.bind(null, company_id));
            };

            /**
             * @param {String} [company_id]
             * @return {Promise}
             */
            $scope.onStopFollowing = function (company_id) {
                var id = $scope.id || company_id;

                utils.assert(id);
                utils.assert(SessionService.USER);

                return ServicesService.query.companies.followers.delete(id, SessionService.USER.id)
                    .then(load.bind(null, id));
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
                ServicesService.extract.wiki(name).then(function (extract) {
                    $scope.vm.fetching_company_summary = false;
                    $scope.company.summary = extract.extract;
                    normalize_company($scope.company);
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
                    created_by: SessionService.USER.id,
                    updated_by: SessionService.USER.id,
                };
            }

            if (!$scope.id) {
                init();
            } else {
                load($scope.id);
            }
        }

        return {
            replace: true,
            templateUrl: '/app/components/company/company.html',
            controller: ['$scope', controller],
            scope: {
                id: '@'
            }
        };
    }
]);
