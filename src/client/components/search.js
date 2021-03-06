/**
 * @attribute {Boolean} redirects to the search page
 * @attribute {String} query search
 */
angular.module('tcp').directive('search', [
    'DOMAIN',
    'Services',
    'Navigation',
    'RecentSearches',
    'lodash',
    function (DOMAIN, Services, Navigation, RecentSearches, lodash) {
        'use strict';

        var SECT_COMPANIES = 'companies',
            SECT_EVENTS = 'events',
            SECT_TAGS = 'tags',
            SECT_USERS = 'users';

        /**
         * get a blank slate state
         * @return {Object}
         */
        function new_state() {
            return {
                cur_section: SECT_EVENTS,
                empty: false,
                loading: false,
                recent: [],
                results: {
                    companies: [],
                    events: [],
                    users: [],
                    tags: [],
                }
            };
        }

        /**
         * @param {String} query
         * @param {ServiceResponseV1} results
         * @return {String[]}
         */
        function track_search(query, results) {
            if (results.meta.total && !lodash.includes(RecentSearches.get(), query)) {
                RecentSearches.unshift(query);
            }

            return RecentSearches.get();
        }

        /**
         * @param {String} query
         * @param {Angular.Scope} $scope
         * @return {Promise}
         */
        function search(query, $scope) {
            $scope.query = query;
            $scope.vm.loading = true;

            return Services.search.query(query).then(function (res) {
                var results = res.body.results,
                    groups = lodash.groupBy(results, 'type');

                $scope.vm.results.companies = groups.company || groups.companies;
                $scope.vm.results.events = groups.event || groups.events;
                $scope.vm.results.users = groups.user || groups.users;
                $scope.vm.results.tags = groups.tag || groups.tags;

                $scope.vm.results.events = lodash.map($scope.vm.results.events, normalize_event);

                $scope.vm.empty = !results || !results.length;
                $scope.vm.loading = false;
                $scope.vm.recent = track_search(query, res);
            });
        }

        function normalize_event(ev) {
            return {
                // for event
                id: ev.id,
                title: ev.name,
                date: ev.source.date,
                logo: ev.source.logo,
                url: ev.source.url,
                summary: ev.summary,

                // for search
                company_id: ev.source.company_id,
            };
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {void}
         */
        function controller($scope) {
            $scope.SECT_COMPANIES = SECT_COMPANIES;
            $scope.SECT_EVENTS = SECT_EVENTS;
            $scope.SECT_TAGS = SECT_TAGS;
            $scope.SECT_USERS = SECT_USERS;

            $scope.nav = Navigation;
            $scope.vm = new_state();

            $scope.search_placeholder = Navigation.one_of([
                Navigation.BASES.HOME,
                Navigation.BASES.SEARCH,
            ]) ? 'admin/search_long_placeholder' : 'admin/search_placeholder';

            $scope.show_section = function (sect) {
                $scope.vm.cur_section = sect;
            };

            $scope.search = lodash.debounce(function (query, $event) {
                if (!query) {
                    return false;
                }

                Navigation.search(query, $event);
                search(query, $scope);
            }, 250);

            if ($scope.query) {
                $scope.search($scope.query);
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                redirects: '@',
                query: '@'
            },
            template: [
                '<div class="search">',
                    '<form ng-submit="search(query, $event)">',
                        '<input prop="placeholder" i18n="{{::search_placeholder}}" ',
                            'name="q" tabindex="1" class="search__input" ',
                            'ng-change="search(query, $event)" ',
                            'ng-focus="!redirects" ng-model="query" />',
                    '</form>',

                    '<div ng-if="query && !redirects" class="can-load margin-top-medium" ng-class="{loading: vm.loading}">',
                        '<snav value="vm.cur_section" class="block snav--borderless">',
                            '<snav-item value="{{SECT_EVENTS}}" ng-click="show_section(SECT_EVENTS)" i18n="pages/events"></snav-item>',
                            '<snav-item value="{{SECT_USERS}}" ng-click="show_section(SECT_USERS)" i18n="pages/people"></snav-item>',
                            '<snav-item value="{{SECT_COMPANIES}}" ng-click="show_section(SECT_COMPANIES)" i18n="pages/companies"></snav-item>',
                            '<snav-item value="{{SECT_TAGS}}" ng-click="show_section(SECT_TAGS)" i18n="pages/tags"></snav-item>',
                        '</snav>',
                        '<hr class="margin-top-xsmall">',

                        '<div class="search__main" ng-if="vm.cur_section === SECT_EVENTS">',
                            '<span class="desktop-only" ng-if="vm.results.events.length">',
                                '<div class="snav__item block" i18n="pages/events"></div>',
                            '</span>',
                            '<a href="/company/id/{{::event.company_id}}/event/{{::event.id}}" ',
                                'ng-repeat="event in vm.results.events" ',
                                'class="a--unstyled">',
                                '<event type="small" model="event" ',
                                    'class="animated fadeIn"></event>',
                            '</a>',
                        '</div>',

                        '<div ng-class="{',
                            'search__side: vm.cur_section === SECT_EVENTS,',
                            '\'margin-top-medium\': vm.cur_section !== SECT_EVENTS,',
                        '}">',
                            '<section ng-if="vm.results.tags.length && (vm.cur_section === SECT_EVENTS || vm.cur_section === SECT_TAGS)" ',
                                'class="line-separated spaced-xlarge">',
                                '<div class="snav__item block" ',
                                    'ng-if="vm.cur_section === SECT_EVENTS" ',
                                    'i18n="pages/tags"></div>',
                                '<tags>',
                                    '<tag class="keyword animated fadeIn" ng-click="nav.tag(tag.id)" ',
                                        'label="{{::tag.name}}" ',
                                        'ng-repeat="tag in vm.results.tags"></tag>',
                                '</tags>',
                            '</section>',

                            '<section ng-if="vm.results.users.length && (vm.cur_section === SECT_EVENTS || vm.cur_section === SECT_USERS)" ',
                                'class="line-separated spaced-xlarge">',
                                '<div class="snav__item block" ',
                                    'ng-if="vm.cur_section === SECT_EVENTS" ',
                                    'i18n="pages/people"></div>',
                                '<avatar name="{{::user.name}}" ',
                                    'class="avatar--medium animated fadeIn" ',
                                    'ng-click="nav.user(user.id)" ',
                                    'ng-repeat="user in vm.results.users" ',
                                    'user-id="{{::user.id}}" ',
                                    'title="{{::user.source.title}}"></avatar>',
                            '</section>',

                            '<section ng-if="vm.results.companies.length && (vm.cur_section === SECT_EVENTS || vm.cur_section === SECT_COMPANIES)" ',
                                'class="line-separated spaced-xlarge">',
                                '<div class="snav__item block" ',
                                    'ng-if="vm.cur_section === SECT_EVENTS" ',
                                    'i18n="pages/companies"></div>',
                                '<div class="animated fadeIn spaced-medium" ng-click="nav.company_by_id(company.id)" ',
                                    'ng-repeat="company in vm.results.companies">',
                                    '<h2>{{::company.name}}</h2>',
                                '</div>',
                            '</section>',
                        '</div>',

                        '<div ng-if="!vm.loading && vm.empty" class="center-align animated fadeIn">',
                            '<h2 i18n="common/no_results" data="{query: query}"></h2>',

                            '<a ng-href="/company?create={{query}}">',
                                '<h3 i18n="common/create_this" data="{name: query}"></h3>',
                            '</a>',

                            '<h4 ng-if="vm.recent.length" i18n="common/recent_searches" ',
                                'class="margin-top-xlarge margin-bottom-medium"></h4>',

                            '<div ng-repeat="recent_search in vm.recent" ',
                                    'class="margin-bottom-xsmall animated fadeInUp" ',
                                    'style="animation-delay: .{{::$index}}s">',
                                '<a ng-click="search(recent_search)">{{recent_search}}</a>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('')
        };
    }
]);
