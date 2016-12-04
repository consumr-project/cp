angular.module('tcp').directive('company', [
    'RUNTIME',
    'EVENTS',
    'DOMAIN',
    'Navigation',
    'Services',
    'Session',
    'utils',
    'utils2',
    'lodash',
    '$q',
    '$window',
    'i18n',
    'slug',
    function (RUNTIME, EVENTS, DOMAIN, Navigation, Services, Session, utils, utils2, lodash, $q, $window, i18n, slug) {
        'use strict';

        var HTML_EDIT = [
            '<div>',
                '<h1>{{company.name}}</h1>',
                '<p>{{normalize_summary(company.summary)[0]}}</p>',
                '<section class="margin-top-medium">',
                    '<label>',
                        '<h2 ng-show="::company.website_url" i18n="company/is_this_website"></h2>',
                        '<h2 ng-show="::!company.website_url" i18n="company/what_is_website"></h2>',
                        '<input class="block"',
                            'i18n="common/website"',
                            'prop="placeholder"',
                            'ng-model="company.website_url" />',
                    '</label>',
                '</section>',
                '<section class="margin-top-medium">',
                    '<label>',
                        '<h2 ng-show="::company.wikipedia_url" i18n="company/is_this_wikipedia"></h2>',
                        '<h2 ng-show="::!company.wikipedia_url" i18n="company/what_is_wikipedia"></h2>',
                        '<input class="block"',
                            'i18n="common/website"',
                            'prop="placeholder"',
                            'ng-model="company.wikipedia_url" />',
                    '</label>',
                '</section>',
                '<section class="margin-top-medium">',
                    '<label>',
                        '<h2 ng-show="::company.twitter_handle" i18n="company/is_this_twitter"></h2>',
                        '<h2 ng-show="::!company.twitter_handle" i18n="company/what_is_twitter"></h2>',
                        '<input class="block"',
                            'i18n="common/twitter"',
                            'prop="placeholder"',
                            'ng-model="company.twitter_handle" />',
                    '</label>',
                '</section>',
                '<section class="margin-top-large">',
                    '<button i18n="admin/save" ng-click="update()"></button>',
                    '<button class="button--unselected" i18n="admin/cancel" ',
                    'ng-click="onCancel()"></button>',
                '</section>',
            '</div>',
        ].join('');

        var HTML_PAGE = [
            '<div class="company-component">',
            '    <error-view class="forced-full-span" ng-if="vm.not_found"></error-view>',

            '    <section ng-if="vm.existing && company.$loaded" class="site-content--main">',
            '        <message closable ng-if="vm.show_event_added_msg" type="success"',
            '            class="margin-top-large message-elem--banner">',
            '            <span i18n="event/good_job_thanks"></span>',
            '        </message>',

            '        <give-us-details companies="vm.new_companies_created"',
            '            class="margin-bottom-xlarge"></give-us-details>',

            '        <h1 class="take-space animated fadeIn screen-small-only padding-bottom-medium">{{company.name}}</h1>',
            '        <div class="screen-small-only">',
            '            <div class="margin-bottom-small"></div>',
            '        </div>',

            '        <table class="full-span">',
            '            <tr>',
            '                <td class="desktop-only half-width">',
            '                    <h1 class="take-space animated fadeIn inline-block">{{company.name}}</h1>',
            '                </td>',
            '                <td class="half-width no-wrap right-align">',
            '                    <a ng-show="::company.website_url" ng-href="{{utils2.make_link(company.website_url)}}"',
            '                        class="snav__item" rel="noreferrer" target="_blank" i18n="common/official_site"></a>',
            '                    <a ng-show="::company.wikipedia_url" ng-href="{{utils2.make_link(company.wikipedia_url)}}"',
            '                        class="snav__item" rel="noreferrer" target="_blank" i18n="common/wikipedia"></a>',
            '                    <button class="margin-left-xsmall logged-in-only--display button--unselected animated fadeIn"',
            '                        ng-click="on_start_following(company.id)"',
            '                        ng-if="vm.followed_by_me === false" i18n="admin/follow"></button>',
            '                    <button class="margin-left-xsmall logged-in-only--display animated fadeIn"',
            '                        ng-click="on_stop_following(company.id)"',
            '                        ng-if="vm.followed_by_me === true" i18n="admin/unfollow"></button>',
            '                </td>',
            '            </tr>',
            '        </table>',

            '        <hr>',

            '        <table class="full-span">',
            '            <tr>',
            '                <td class="no-wrap half-width">',
            '                    <div class="snav__item inline-block" ng-click="show_events()" i18n="event/timeline"></div>',
            '                    <div class="snav__item inline-block" ng-click="show_qa()" i18n="qa/qa"></div>',
            '                </td>',
            '                <td class="no-wraphalf-width">',
            '                    <div ng-click="show_reviews()" class="no-wrap">',
            '                        <table class="right">',
            '                            <tr>',
            '                                <td>',
            '                                    <chart type="heartcount" value="{{::reviews_score.iaverage}}"></chart>',
            '                                </td>',
            '                                <td>',
            '                                    <span ng-if="reviews_score.count" class="snav__item" i18n="review/count" data="{count: reviews_score.count}"></span>',
            '                                    <span ng-if="!reviews_score.count" class="snav__item" i18n="review/count" data="{count: 0}"></span>',
            '                                </td>',
            '                            </tr>',
            '                        </table>',
            '                    </div>',
            '                </td>',
            '            </tr>',
            '        </table>',

            '        <review company-id="{{company.id}}" company-name="{{company.name}}"',
            '            class="margin-bottom-xlarge"',
            '            on-save="hide_review_form()"',
            '            on-cancel="hide_review_form()"',
            '            ng-if="vm.show_review_form"></review>',

            '        <section ng-if="vm.show_reviews">',
            '            <button class="logged-in-only margin-top-xlarge margin-bottom-xsmall"',
            '                ng-click="show_review_form()" i18n="review/add"></button>',
            '            <reviews company-id="{{company.id}}"',
            '                class="margin-top-medium margin-bottom-xlarge"></reviews>',
            '        </section>',

            '        <section ng-if="vm.show_qa" class="company-component__qa animated fadeIn">',
            '            <center>',
            '                <img src="/assets/images/pizza.svg" alt="Pizza!" />',
            '            </center>',
            '            <p class="p--standout" i18n="qa/coming_soon" data="{name: company.name}"></p>',
            '        </section>',

            '        <section ng-if="vm.show_events">',
            '            <div class="margin-top-large half-width" ng-if="vm.events_filter.length">',
            '                <h4 i18n="common/only_showing"></h4>',
            '                <tag ng-repeat="filter in vm.events_filter"',
            '                    ng-click="nav.tag(filter.id)"',
            '                    class="tag--bigword" label="{{get_label(filter)}}"></tag>',
            '            </div>',

            '            <timeline class="margin-top-medium component__timeline"',
            '                filters="vm.events_filter"',
            '                api="vm.events_timeline"',
            '                parent="companies"',
            '                on-add="vm.add_event.show()"',
            '                on-event="event_handler(type, data)"',
            '                event-id="{{eventId}}"',
            '                id="{{company.id}}"></timeline>',
            '        </section>',

            '        <popover with-close-x with-backdrop api="vm.add_event" class="popover--with-content popover--with-padded-content">',
            '            <event',
            '                api="vm.event_form"',
            '                on-save="event_added()"',
            '                on-event="event_handler(type, data)"',
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
            '        <section ng-if="!vm.company_options.length">',
            '            <h2 i18n="common/no_results" data="{query: vm.search_name}"></h2>',
            '        </section>',

            '        <section ng-if="vm.company_options.length">',
            '            <h2 i18n="common/results"></h2>',
            '            <div ng-repeat="option in vm.company_options | limitTo:10" ng-click="set_company(option.title)">',
            '                <p class="highlight-action padding-right-xsmall padding-left-xsmall margin-right-xsmall-negative margin-left-xsmall-negative">',
            '                    <b>{{::option.title}}</b><span ng-if="::option.snippet">: {{::option.snippet}}</span>',
            '                </p>',
            '            </div>',

            '            <hr>',
            '            <h2 class="margin-top-medium" i18n="company/bad_results"></h2>',
            '        </section>',

            '        <div>',
            '            <button class="margin-top-medium"',
            '                ng-click="create_yourself(vm.search_name)"',
            '                i18n="company/create_yourself"></button>',
            '        </div>',
            '    </section>',

            '    <p ng-if="!vm.existing" class="animated fadeIn" ',
            '        ng-repeat="paragraph in company.$summary_parts">{{::paragraph}}</p>',

            '    <section ng-if="vm.existing && company.$loaded" class="site-content--aside">',
            '        <div class="desktop-only site-content--aside__section">',
            '            <h3 class="margin-bottom-medium" i18n="company/common_tags"></h3>',
            '            <tag class="keyword" label="{{::tag.label}}" active="{{tag.$selected}}"',
            '               ng-click="toggle_common_tag(tag)" ng-repeat="tag in common_tags | limitTo: vm.common_tags_limit"></tag>',
            '            <h5 ng-click="show_more_common_tags()" class="margin-top-xsmall a--action"',
            '                ng-if="common_tags.length && common_tags.length > vm.common_tags_limit"',
            '                i18n="common/show_more"></h5>',
            '            <i ng-if="!common_tags.length" i18n="common/none"></i>',
            '        </div>',

            // '        <div class="site-content--aside__section site-content--aside__section-standout">',
            // '            <h3 i18n="common/about" class="desktop-only margin-bottom-medium"></h3>',
            // '            <p ng-repeat="paragraph in company.$summary_parts">{{::paragraph}}</p>',
            // '            <a target="_blank" rel="noreferrer" ng-show="::company.wikipedia_url"',
            // '                ng-href="{{::company.wikipedia_url}}" class="a--action"',
            // '                i18n="common/see_wikipedia"></a>',
            // '            <div class="margin-top-medium">',
            // '                <tag ng-repeat="product in company_products"',
            // '                    class="tag--word" label="{{get_label(product)}}"></tag>',
            // '            </div>',
            // '        </div>',

            '        <div class="desktop-only site-content--aside__section">',
            '            <h3 class="margin-bottom-medium" i18n="company/related_companies"></h3>',
            '            <tag ng-click="go_to_company(comp)" class="keyword" label="{{::comp.label}}"',
            '                ng-repeat="comp in common_companies | limitTo: vm.common_companies_limit"></tag>',
            '            <i ng-if="!common_companies.length" i18n="common/none"></i>',
            '            <h5 ng-click="show_more_common_companies()" class="margin-top-xsmall a--action"',
            '                ng-if="common_companies.length && common_companies.length > vm.common_companies_limit"',
            '                i18n="common/show_more"></h5>',
            '        </div>',
            '    </section>',

            '    <div ng-if="!vm.existing && vm.step.length > 1" class="animated fadeIn margin-top-large margin-bottom-xlarge">',
            '        <h1 i18n="company/what_is_the_website_for" data="{name: company.name}"></h1>',
            '        <input class="block title"',
            '            i18n="common/website"',
            '            prop="placeholder"',
            '            ng-focus="true"',
            '            ng-model="company.website_url" />',
            '    </div>',

            '    <div ng-if="!vm.existing && vm.step.length > 2" class="animated fadeIn margin-top-large margin-bottom-xlarge">',
            '        <h1 i18n="company/twitter_handle"></h1>',
            '        <input class="block title"',
            '            i18n="common/twitter"',
            '            prop="placeholder"',
            '            ng-focus="true"',
            '            ng-model="company.twitter_handle" />',
            '    </div>',

            '    <div ng-if="!vm.existing && vm.step.length > 3" class="animated fadeIn margin-top-large margin-bottom-xlarge">',
            '        <h1 i18n="company/what_do_they_do" data="{name: company.name}"></h1>',
            '        <pills',
            '            class="pills--bigone"',
            '            style="margin-bottom: 240px;"',
            '            ng-focus="true"',
            '            selections="company.$products"',
            '            create="create_product(value, done)"',
            '            query="query_products(query, done)"',
            '            placeholder="samples/products"',
            '        ></pills>',
            '    </div>',

            '    <section ng-if="!vm.existing">',
            '        <div class="margin-top-medium margin-bottom-medium" ng-show="company.$loaded">',
            '            <button ng-if="is_last_step()" ng-click="save()" i18n="company/create"></button>',
            '            <button ng-if="!is_last_step()" ng-click="next_step()" i18n="admin/this_is_it"></button>',
            '            <button ng-click="back_to_search()" i18n="admin/go_back" class="button--secondary"></button>',
            '        </div>',
            '    </section>',
            '</div>'
        ].join('');

        var HTML_VIEW = [
            '<div>',
            '    <h2>{{::model.name}}</h2>',
            '    <a rel="noreferrer" target="_blank" ng-href="{{::utils2.make_link(model.website_url)}}">{{::model.website_url}}</a>',
            '    <p>{{::model.summary}}</p>',
            '<div>',
        ].join('');

        function template(elem, attrs) {
            switch (attrs.type) {
                case 'view': return HTML_VIEW;
                case 'edit': return HTML_EDIT;
                default: return HTML_PAGE;
            }
        }

        function auth_check() {
            if (!Session.USER || !Session.USER.id) {
                $window.alert(i18n.get('admin/error_login_to_create_company'));
                Navigation.home();
            }
        }

        function error_updating_company() {
            $window.alert(i18n.get('admin/error_updating_company'));
        }

        /**
         * @param {Error} [err]
         */
        function error_creating_company(err) {
            var message = lodash.get(err, 'data.meta.message');

            if (message) {
                $window.alert(i18n.get('admin/error_creating_company_msg', {
                    message: message
                }));
            } else {
                $window.alert(i18n.get('admin/error_creating_company'));
            }
        }

        function controller($scope, $attrs) {
            $scope.nav = Navigation;
            $scope.utils2 = utils2;

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
                followed_by_me: null,
                step: [true],
                pre_search_name: '',
                search_name: '',
                common_tags_limit: 5,
                common_companies_limit: 5,
                existing: !!$scope.guid || $scope.id,
                events_filter: [],
                events_timeline: {},
                event_form: {},
                add_event: {},

                show_qa: false,
                show_review_form: false,
                show_reviews: false,
                show_events: true,
                show_event_added_msg: false,
                new_companies_created: [],
            };

            $scope.event_added = function () {
                $scope.vm.events_timeline.refresh();
                $scope.vm.add_event.hide();
                $scope.vm.event_form.reset();
                $scope.vm.show_event_added_msg = true;
            };

            $scope.event_handler = function (type, data) {
                utils.assert(type);
                utils.assert(data);
                data = utils2.as_array(data);

                switch (type) {
                    case EVENTS.INCOMPLETE_COMPANY_CREATED:
                        $scope.vm.new_companies_created = data;
                        break;
                }
            };

            $scope.show_reviews = function () {
                if ($scope.vm.show_review_form) {
                    $scope.vm.show_reviews = false;
                    $scope.vm.show_review_form = true;
                } else {
                    $scope.vm.show_reviews = true;
                    $scope.vm.show_review_form = false;
                }

                $scope.vm.show_qa = false;
                $scope.vm.show_events = false;
            };

            $scope.show_events = function () {
                $scope.vm.show_review_form = false;
                $scope.vm.show_reviews = false;
                $scope.vm.show_events = true;
                $scope.vm.show_qa = false;
            };

            $scope.show_review_form = function () {
                $scope.vm.show_review_form = true;
                $scope.vm.show_reviews = false;
                $scope.vm.show_qa = false;
            };

            $scope.hide_review_form = function () {
                $scope.vm.show_review_form = false;
                $scope.vm.show_reviews = true;
                $scope.vm.show_qa = false;
            };

            $scope.show_qa = function () {
                $scope.vm.show_review_form = false;
                $scope.vm.show_reviews = false;
                $scope.vm.show_events = false;
                $scope.vm.show_qa = true;
            };

            $scope.update = function () {
                utils.assert(Session.USER, 'login required for action');

                return Services.query.companies.update($scope.company.id, {
                    twitter_handle: $scope.company.twitter_handle,
                    website_url: $scope.company.website_url,
                    wikipedia_url: $scope.company.wikipedia_url,
                })
                    .then($scope.onSaved)
                    .catch(error_updating_company);
            };

            /**
             * @return {Promise}
             */
            $scope.save = function () {
                utils.assert(Session.USER, 'login required for action');
                utils.assert($scope.company.name, 'company name is required');

                // XXX should be one request
                return Services.query.companies.create(get_new_company_object()).then(function (company) {
                    return $scope.on_start_following(company.id).then(function () {
                        return $q.all(lodash.map($scope.company.$products, function (product) {
                            return Services.query.companies.products.upsert(company.id, {
                                company_id: company.id,
                                product_id: product.id,
                            });
                        })).then(function () {
                            Navigation.company(company.guid);
                            console.info('saved company', company.id);
                            return company;
                        });
                    });
                }).catch(error_creating_company);
            };

            /**
             * @param {String} name
             */
            $scope.create_yourself = function (name) {
                utils.assert(name);

                Services.extract.wikipedia.extract.cancel();

                $scope.vm.company_options = null;
                $scope.vm.pre_search_name = $scope.vm.search_name;
                $scope.vm.step = [true, true];

                $scope.company = {};
                $scope.company.name = name;
                $scope.company.summary = '';
                $scope.company.wikipedia_url = '';
                $scope.company.website_url = '';
                $scope.company.twitter_handle = '';

                normalize_company($scope.company);
            };

            /**
             * @param {String} name
             * @return {Promise}
             */
            $scope.set_company = function (name) {
                utils.assert(name);

                Services.extract.wikipedia.extract.cancel();
                return Services.extract.wikipedia.extract(name).then(function (res) {
                    $scope.vm.company_options = null;
                    $scope.vm.pre_search_name = $scope.vm.search_name;
                    $scope.vm.search_name = res.body.title;
                    $scope.company.name = res.body.title;
                    $scope.company.summary = res.body.extract;
                    $scope.company.wikipedia_url = 'https://en.wikipedia.org/?curid=' + res.body.id;
                    $scope.company.website_url = 'https://' + slug(res.body.title) + '.com';

                    normalize_company($scope.company);


                    // get a better website url
                    Services.extract.wikipedia.infobox.cancel();
                    return Services.extract.wikipedia.infobox(name).then(function (res) {
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

                Services.extract.wikipedia.search.cancel();
                Services.extract.wikipedia.search(name).then(function (res) {
                    $scope.vm.loading = false;
                    $scope.vm.company_options = res.body;
                    $scope.company.$loaded = false;
                }).catch(function () {
                    $scope.vm.loading = false;
                    $scope.vm.company_options = [];
                    $scope.company.$loaded = false;
                });
            };

            $scope.next_step = function () {
                $scope.vm.step.push(true);
            };

            $scope.is_last_step = function () {
                return $scope.vm.step.length === 4;
            };

            $scope.reset = function () {
                $scope.company.name = null;
                $scope.company.summary = null;
                $scope.company.wikipedia_url = null;
                $scope.company.website_url = null;
                $scope.company.twitter_handle = null;
                $scope.company.$summary_parts = null;
                $scope.company.$products = [];
                $scope.vm.search_name = $scope.vm.pre_search_name;
                $scope.vm.step = [true];
            };

            $scope.back_to_search = function () {
                $scope.reset();
                $scope.find_companies($scope.vm.search_name);
            };

            $scope.create_product = function (str, done) {
                var product = {};

                utils.assert(str, done);
                utils.assert(Session.USER.id);

                product.id = Services.query.UUID;
                product.created_by = Session.USER.id;
                product.updated_by = Session.USER.id;
                product[RUNTIME.locale] = str;

                Services.query.products.create(product).then(function (product) {
                    done(null, normalize_product(product));
                }).catch(done);
            };

            $scope.query_products = function (str, done) {
                Services.query.search.products(RUNTIME.locale, str).then(function (products) {
                    done(null, lodash.map(products, normalize_product));
                }).catch(done);
            };

            /**
             * @param {String} company_id
             * @return {Promise}
             */
            $scope.on_start_following = function (company_id) {
                utils.assert(company_id);
                utils.assert(Session.USER);

                return Services.query.companies.followers.upsert(company_id, {
                    user_id: Session.USER.id
                }).then(utils.scope.set($scope, 'vm.followed_by_me', true));
            };

            /**
             * @param {String} company_id
             * @return {Promise}
             */
            $scope.on_stop_following = function (company_id) {
                utils.assert(company_id);
                utils.assert(Session.USER);

                return Services.query.companies.followers.delete(company_id, Session.USER.id)
                    .then(utils.scope.set($scope, 'vm.followed_by_me', false));
            };

            /**
             * @param {Object} tag
             * @return {void}
             */
            $scope.toggle_common_tag = function (tag) {
                if (!$scope.vm.show_events) {
                    return false;
                }

                tag.type = DOMAIN.model.tag;
                tag.$selected = !tag.$selected;

                if (tag.$selected) {
                    $scope.vm.events_filter.push(tag);
                } else {
                    lodash.pull($scope.vm.events_filter, tag);
                }
            };

            /**
             * @return {void}
             */
            $scope.show_more_common_tags = function () {
                $scope.vm.common_tags_limit += 5;
            };

            /**
             * @return {void}
             */
            $scope.show_more_common_companies = function () {
                $scope.vm.common_companies_limit += 5;
            };

            /**
             * @return {void}
             */
            $scope.go_to_company = function (comp) {
                Navigation.company_by_id(comp.id);
            };

            $scope.get_label = function (obj) {
                return obj[RUNTIME.locale] || obj.label;
            };

            /**
             * @param {string} summary
             * @return {string[]}
             */
            $scope.normalize_summary = function (summary) {
                return !!summary ? [lodash.head(lodash.filter(summary.split('\n')))] : [];
            };

            /**
             * @param {String} guid
             * @param {String} [method]
             * @return {Promise}
             */
            function load(guid, method) {
                method = method || 'guid';
                return Services.query.companies[method](guid)
                    .then(utils.scope.not_found($scope))
                    .then(normalize_company)
                    .then(utils.scope.set($scope, 'company'))
                    .then(function (company) {
                        if ($attrs.type === 'edit') {
                            return company;
                        }

                        Services.query.companies.retrieve(company.id, ['products', 'followers'], ['products'])
                            .then(function (company) {
                                $scope.vm.followed_by_me = company.followers['@meta'].instead.includes_me;
                                $scope.company_products = company.products;
                                return company;
                            });

                        Services.query.companies.common.tags(company.id)
                            .then(utils.scope.set($scope, 'common_tags'));

                        Services.query.companies.common.companies(company.id)
                            .then(utils.scope.set($scope, 'common_companies'));

                        Services.query.companies.reviews.score(company.id)
                            .then(function (score) {
                                score.iaverage = Math.round(score.average);
                                return score;
                            })
                            .then(utils.scope.set($scope, 'reviews_score'));

                        return company;
                    })
                    .catch(function () {
                        utils.scope.not_found($scope)(false);
                    });
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
                company.$summary_parts = $scope.normalize_summary(company.summary);

                return company;
            }

            /**
             * @return {Company}
             */
            function get_new_company_object() {
                return {
                    id: $scope.company.id || Services.query.UUID,
                    name: $scope.company.name,
                    guid: slug($scope.company.name),
                    summary: $scope.company.summary,
                    website_url: $scope.company.website_url,
                    twitter_handle: $scope.company.twitter_handle,
                    wikipedia_url: $scope.company.wikipedia_url,
                    created_by: Session.USER.id,
                    updated_by: Session.USER.id,
                };
            }

            if ($scope.guid) {
                load($scope.guid);
            } else if ($scope.id) {
                load($scope.id, 'retrieve');
            } else if ($scope.create) {
                $scope.vm.search_name = $scope.create;
                $scope.find_companies($scope.create);
                auth_check();
            } else if (!$scope.model) {
                auth_check();
            }
        }

        return {
            replace: true,
            controller: ['$scope', '$attrs', controller],
            template: template,
            scope: {
                model: '=',
                id: '@',
                eventId: '@',
                onSaved: '&',
                onCancel: '&',
                guid: '@',
                create: '@'
            },
        };
    }
]);
