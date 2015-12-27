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
                guid: null,
                name: null,
                summary: null,
                wikipedia_page_id: null
            };

            $scope.vm = {
                existing: !!$scope.guid,
                add_event: {}
            };

            /**
             * @return {Promise}
             */
            $scope.save = function () {
                utils.assert(SessionService.USER, 'login required for action');
                utils.assert($scope.company.name, 'company name is required');

                return ServicesService.query.companies.create(get_new_company_object()).then(function (company) {
                    return $scope.on_start_following(company.id).then(function () {
                        NavigationService.company(company.guid);
                        console.info('saved company', company.id);
                        return company;
                    });
                });
            };

            /**
             * @param {String} name of company
             * @return {Promise}
             */
            $scope.get_company = function (name) {
                utils.assert(name);

                $scope.vm.loading = true;

                ServicesService.extract.wiki.cancel();
                ServicesService.extract.wiki(name).then(function (res) {
                    $scope.vm.loading = false;
                    $scope.vm.company_options = null;

                    $scope.company.name = name;
                    $scope.company.summary = res.body.extract;
                    $scope.company.wikipedia_page_id = res.body.id;

                    normalize_company($scope.company);
                });
            };

            /**
             * @param {String} name of company
             * @return {Promise}
             */
            $scope.find_companies = function (name) {
                utils.assert(name);

                $scope.vm.loading = true;
                $scope.vm.company_options = null;

                ServicesService.extract.search.cancel();
                ServicesService.extract.search(name).then(function (res) {
                    $scope.vm.loading = false;
                    $scope.vm.company_options = res.body;
                });
            };

            /**
             * @param {String} company_id
             * @return {Promise}
             */
            $scope.load_followers = function (company_id) {
                utils.assert(company_id);

                return ServicesService.query.companies.followers.retrieve(company_id)
                    .then(utils.scope.set($scope, 'company.$followed_by'));
            };

            /**
             * @param {String} company_id
             * @return {Promise}
             */
            $scope.on_start_following = function (company_id) {
                utils.assert(company_id);
                utils.assert(SessionService.USER);

                return ServicesService.query.companies.followers.upsert(company_id, {
                    user_id: SessionService.USER.id
                }).then($scope.load_followers.bind(null, company_id));
            };

            /**
             * @param {String} company_id
             * @return {Promise}
             */
            $scope.on_stop_following = function (company_id) {
                utils.assert(company_id);
                utils.assert(SessionService.USER);

                return ServicesService.query.companies.followers.delete(company_id, SessionService.USER.id)
                    .then(load.bind(null, company_id));
            };

            /**
             * @param {String} guid
             * @return {Promise}
             */
            function load(guid) {
                return ServicesService.query.companies.guid(guid)
                    .then(utils.scope.not_found($scope))
                    .then(normalize_company)
                    .then(utils.scope.set($scope, 'company'));
            }

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
             * @return {Company}
             */
            function get_new_company_object() {
                return {
                    id: $scope.company.id || ServicesService.query.UUID,
                    name: $scope.company.name,
                    guid: utils.simplify($scope.company.name),
                    summary: $scope.company.summary,
                    wikipedia_page_id: $scope.company.wikipedia_page_id,
                    created_by: SessionService.USER.id,
                    updated_by: SessionService.USER.id,
                };
            }

            if ($scope.guid) {
                load($scope.guid);
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                guid: '@'
            },
            template: [
                '<div>',
                '    <message ng-if="vm.not_found" type="error" i18n="common/not_found"></message>',

                '    <section ng-if="vm.existing && company.$loaded" ng-init="load_followers(company.id)">',
                '        <h1 class="take-space animated fadeIn" ng-if="vm.existing">{{company.name}}</h1>',
                '        <followed-by',
                '            users="company.$followed_by"',
                '            on-start-following="on_start_following(company.id)"',
                '            on-stop-following="on_stop_following(company.id)"',
                '        ></followed-by>',
                '    </section>',

                '    <section ng-if="!vm.existing">',
                '        <input class="block title" type="text" autofocus="true"',
                '            i18n="company/name_placeholder" prop="placeholder"',
                '            ng-class="{ loading: vm.loading }"',
                '            ng-change="find_companies(company.name)"',
                '            ng-model="company.name" ng-model-options="{ debounce: 300 }" />',

                '        <div class="margin-top-medium margin-bottom-medium">',
                '            <button ng-click="save()" i18n="admin/save"></button>',
                '        </div>',
                '    </section>',

                '    <section ng-if="vm.existing && company.$loaded">',
                '        <div class="margin-top-medium margin-bottom-medium">',
                '            <button ng-click="vm.add_event.show()" i18n="company/add_event"></button>',
                '        </div>',

                '        <popover popover-backdrop popover-api="vm.add_event" class="popover--with-content">',
                '            <company-event',
                '                on-save="vm.add_event.hide()"',
                '                on-cancel="vm.add_event.hide()"',
                '                tied-to="{companies: [company]}"',
                '            ></company-event>',
                '        </popover>',
                '    </section>',

                '    <section ng-if="vm.company_options" class="margin-top-xlarge animated fadeIn">',
                '        <section ng-if="!vm.company_options.length" class="center-align">',
                '            <h2 i18n="common/no_results" data="{query: company.name}"></h2>',
                '        </section>',
                '        <section ng-if="vm.company_options.length">',
                '            <h2 i18n="common/results"></h2>',
                '            <div ng-repeat="option in vm.company_options" ng-click="get_company(option.title)">',
                '                <p><b>{{option.title}}</b>: {{option.snippet}}</p>',
                '            </div>',
                '        </section>',
                '    </section>',

                '    <p ng-if="!vm.existing" class="animated fadeIn" ',
                '        ng-repeat="paragraph in company.$summary_parts">{{::paragraph}}</p>',

                '    <section ng-if="vm.existing && company.$loaded" class="site-content--aside site-content--aside-section-standout padding-top-medium padding-bottom-medium">',
                '        <h3 i18n="common/about" class="desktop-only"></h3>',
                '        <p ng-repeat="paragraph in company.$summary_parts">{{::paragraph}}</p>',
                '        <a i18n="company/see_more_wiki" target="_blank" ng-href="https://en.wikipedia.org/?curid={{company.wikipedia_page_id}}" class="--action"></a>',
                '    </section>',
                '</div>'
            ].join('')
        };
    }
]);
