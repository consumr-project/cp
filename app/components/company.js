angular.module('tcp').directive('company', [
    'NavigationService',
    'ServicesService',
    'SessionService',
    'utils',
    'lodash',
    function (NavigationService, ServicesService, SessionService, utils, lodash) {
        'use strict';

        function controller($scope) {
            $scope.company = {
                $followed_by: [],
                $loaded: false,
                $summary_parts: [],
                id: null,
                guid: null,
                name: null,
                summary: null
            };

            $scope.vm = {
                existing: !!$scope.guid || $scope.id,
                events_timeline: {},
                event_form: {},
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
             * @param {String} name
             * @return {Promise}
             */
            $scope.set_company = function (name) {
                utils.assert(name);

                ServicesService.extract.wikipedia.extract.cancel();
                ServicesService.extract.wikipedia.extract(name).then(function (res) {
                    $scope.vm.company_options = null;
                    $scope.company.name = res.body.title;
                    $scope.company.summary = res.body.extract;
                    $scope.company.wikipedia_url = 'https://en.wikipedia.org/?curid=' + res.body.id;

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

                ServicesService.extract.wikipedia.search.cancel();
                ServicesService.extract.wikipedia.search(name).then(function (res) {
                    $scope.vm.loading = false;
                    $scope.vm.company_options = res.body;
                    $scope.company.$loaded = false;
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
                    .then(load.bind(null, company_id, 'retrieve'));
            };

            /**
             * @param {String} guid
             * @param {String} [method]
             * @return {Promise}
             */
            function load(guid, method) {
                method = method || 'guid';
                return ServicesService.query.companies[method](guid)
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
                    lodash.filter(company.summary.split('\n'));

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
                    wikipedia_url: $scope.company.wikipedia_url,
                    created_by: SessionService.USER.id,
                    updated_by: SessionService.USER.id,
                };
            }

            if ($scope.guid) {
                load($scope.guid);
            } else if ($scope.id) {
                load($scope.id, 'retrieve');
            } else if ($scope.create) {
                $scope.company.name = $scope.create;
                $scope.find_companies($scope.create);
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                id: '@',
                guid: '@',
                create: '@'
            },
            template: [
                '<div>',
                '    <message ng-if="vm.not_found" type="error" i18n="common/not_found"></message>',

                '    <section ng-if="vm.existing && company.$loaded" ng-init="load_followers(company.id)" class="site-content--main">',
                '        <h1 class="take-space animated fadeIn">{{company.name}}</h1>',
                '        <followed-by',
                '            users="company.$followed_by"',
                '            on-start-following="on_start_following(company.id)"',
                '            on-stop-following="on_stop_following(company.id)"',
                '        ></followed-by>',

                '        <hr>',

                '        <div class="margin-top-xlarge margin-bottom-medium center-align">',
                '            <button ng-click="vm.add_event.show()" i18n="event/add"></button>',
                '        </div>',

                '        <events class="margin-top-medium margin-bottom-xlarge" ',
                '            api="vm.events_timeline" ',
                '            id="{{company.id}}"></events>',

                '        <popover with-close-x with-backdrop api="vm.add_event" class="popover--with-content">',
                '            <event',
                '                api="vm.event_form"',
                '                on-save="vm.events_timeline.refresh(); vm.add_event.hide(); vm.event_form.reset()"',
                '                on-cancel="vm.event_form.reset(); vm.add_event.hide()"',
                '                tied-to="{companies: [company]}"',
                '            ></event>',
                '        </popover>',
                '    </section>',

                '    <section ng-if="!vm.existing">',
                '        <input class="block title" type="text" ng-focus="true"',
                '            i18n="company/name_placeholder" prop="placeholder"',
                '            ng-class="{ loading: vm.loading }"',
                '            ng-change="find_companies(company.name)"',
                '            ng-model="company.name" ng-model-options="{ debounce: 300 }" />',

                '        <div class="margin-top-medium margin-bottom-medium" ng-show="company.$loaded">',
                '            <button ng-click="save()" i18n="admin/save"></button>',
                '        </div>',
                '    </section>',

                '    <section ng-if="vm.company_options" class="margin-top-xlarge animated fadeIn">',
                '        <section ng-if="!vm.company_options.length" class="center-align">',
                '            <h2 i18n="common/no_results" data="{query: company.name}"></h2>',
                '        </section>',
                '        <section ng-if="vm.company_options.length">',
                '            <h2 i18n="common/results"></h2>',
                '            <div ng-repeat="option in vm.company_options" ng-click="set_company(option.title)">',
                '                <p>',
                '                    <b>{{option.title}}</b><span ng-if="option.snippet">: {{option.snippet}}</span>',
                '                </p>',
                '            </div>',
                '        </section>',
                '    </section>',

                '    <p ng-if="!vm.existing" class="animated fadeIn" ',
                '        ng-repeat="paragraph in company.$summary_parts">{{::paragraph}}</p>',

                '    <section ng-if="vm.existing && company.$loaded" class="site-content--aside site-content--aside-section-standout">',
                '        <div class="padding-top-medium desktop-only"></div>',
                '        <h3 i18n="common/about" class="desktop-only margin-bottom-medium"></h3>',
                '        <p ng-repeat="paragraph in company.$summary_parts">{{::paragraph}}</p>',
                '        <a target="_blank" ng-show="::company.wikipedia_url" ng-href="{{::company.wikipedia_url}}" class="--action" i18n="common/see_wiki"></a>',
                '        <div class="padding-bottom-medium desktop-only"></div>',
                '    </section>',
                '</div>'
            ].join('')
        };
    }
]);
