angular.module('tcp').directive('company', [
    'RUNTIME',
    'NavigationService',
    'ServicesService',
    'SessionService',
    'utils',
    'lodash',
    '$q',
    function (RUNTIME, NavigationService, ServicesService, SessionService, utils, lodash, $q) {
        'use strict';

        function controller($scope) {
            $scope.company = {
                $followed_by: [],
                $loaded: false,
                $summary_parts: [],
                $products: [],
                id: null,
                guid: null,
                name: null,
                summary: null
            };

            $scope.vm = {
                step: [true],
                pre_search_name: '',
                search_name: '',
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

                // XXX should be one request
                return ServicesService.query.companies.create(get_new_company_object()).then(function (company) {
                    return $scope.on_start_following(company.id).then(function () {
                        return $q.all(lodash.map($scope.company.$products, function (product) {
                            return ServicesService.query.companies.products.upsert(company.id, {
                                company_id: company.id,
                                product_id: product.id,
                            });
                        })).then(function () {
                            NavigationService.company(company.guid);
                            console.info('saved company', company.id);
                            return company;
                        });
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
                return ServicesService.extract.wikipedia.extract(name).then(function (res) {
                    $scope.vm.company_options = null;
                    $scope.vm.pre_search_name = $scope.vm.search_name;
                    $scope.vm.search_name = res.body.title;
                    $scope.company.name = res.body.title;
                    $scope.company.summary = res.body.extract;
                    $scope.company.wikipedia_url = 'https://en.wikipedia.org/?curid=' + res.body.id;
                    $scope.company.website_url = 'https://' + utils.simplify(res.body.title) + '.com';

                    normalize_company($scope.company);


                    // get a better website url
                    ServicesService.extract.wikipedia.infobox.cancel();
                    return ServicesService.extract.wikipedia.infobox(name).then(function (res) {
                        $scope.company.website_url = lodash.head(lodash.get(res, 'body.parts.urls')) ||
                            $scope.company.website_url;
                    });
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

            $scope.next_step = function () {
                $scope.vm.step.push(true);
            };

            $scope.is_last_step = function () {
                return $scope.vm.step.length === 3;
            };

            $scope.reset = function () {
                $scope.company.name = null;
                $scope.company.summary = null;
                $scope.company.wikipedia_url = null;
                $scope.company.website_url = null;
                $scope.company.$summary_parts = null;
                $scope.company.$products = [];
                $scope.vm.search_name = $scope.vm.pre_search_name;
                $scope.vm.step = [true];
            };

            $scope.back_to_search = function () {
                $scope.reset();
                $scope.find_companies($scope.vm.search_name);
            };

            $scope.query_products = function (str, done) {
                ServicesService.query.search.products(RUNTIME.locale, str).then(function (products) {
                    done(null, lodash.map(products, normalize_product));
                }).catch(done);
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
             * @param {Object} product
             * @return {Object}
             */
            function normalize_product(product) {
                return {
                    type: 'product-approved-' + product.approved.toString(),
                    label: product[RUNTIME.locale],
                    id: product.id
                };
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
                    website_url: $scope.company.website_url,
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
                $scope.vm.search_name = $scope.create;
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
                // '    <message class="message-elem--banner" type="success">you added 5 new companies, good job! we just need a few more details.</message>',

                '    <section ng-if="vm.existing && company.$loaded" ng-init="load_followers(company.id)" class="site-content--main">',
                '        <h1 class="take-space animated fadeIn inline-block">{{company.name}}</h1>',
                '        <a ng-if="company.website_url" href="{{company.website_url}}"',
                '            target="_blank" class="linkimg animated fadeIn"></a>',

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
                '        <input ng-show="vm.step.length === 1" ',
                '            class="block title" type="text" ng-focus="true"',
                '            i18n="company/name_placeholder" prop="placeholder"',
                '            ng-class="{ loading: vm.loading }"',
                '            ng-change="find_companies(vm.search_name)"',
                '            ng-model="vm.search_name" ng-model-options="{ debounce: 300 }" />',

                '        <h1 ng-show="vm.step.length > 1">{{company.name}}</h1>',
                '    </section>',

                '    <section ng-if="vm.company_options" class="margin-top-xlarge animated fadeIn">',
                '        <section ng-if="!vm.company_options.length" class="center-align">',
                '            <h2 i18n="common/no_results" data="{query: vm.search_name}"></h2>',
                '        </section>',
                '        <section ng-if="vm.company_options.length">',
                '            <h2 i18n="common/results"></h2>',
                '            <div ng-repeat="option in vm.company_options" ng-click="set_company(option.title)">',
                '                <p class="highlight-action padding-right-xsmall padding-left-xsmall margin-right-xsmall-negative margin-left-xsmall-negative">',
                '                    <b>{{::option.title}}</b><span ng-if="::option.snippet">: {{::option.snippet}}</span>',
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

                '    <div ng-if="!vm.existing && vm.step.length > 1" class="animated fadeIn margin-top-large margin-bottom-xlarge">',
                '        <h1 i18n="company/what_is_the_website" data="{name: company.name}"></h1>',
                '        <input class="block title" ng-focus="true" ng-model="company.website_url" />',
                '    </div>',

                '    <div ng-if="!vm.existing && vm.step.length > 2" class="animated fadeIn margin-top-large margin-bottom-xlarge">',
                '        <h1 i18n="company/what_do_they_do" data="{name: company.name}"></h1>',
                '        <pills',
                '            class="pills--bigone"',
                '            ng-focus="true"',
                '            selections="company.$products"',
                '            query="query_products(query, done)"',
                '            placeholder="samples/products"',
                '        ></pills>',
                '    </div>',

                '    <section ng-if="!vm.existing">',
                '        <div class="margin-top-medium margin-bottom-medium" ng-show="company.$loaded">',
                '            <button ng-if="is_last_step()" ng-click="save()" i18n="admin/this_is_it"></button>',
                '            <button ng-if="!is_last_step()" ng-click="next_step()" i18n="admin/this_is_it"></button>',
                '            <button ng-click="back_to_search()" i18n="admin/go_back" class="button--secondary"></button>',
                '        </div>',
                '    </section>',
                '</div>'
            ].join('')
        };
    }
]);
