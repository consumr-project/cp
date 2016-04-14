angular.module('tcp').directive('events', [
    'DOMAIN',
    '$q',
    '$timeout',
    'lodash',
    'utils',
    'i18n',
    'Services',
    'Session',
    function (DOMAIN, $q, $timeout, lodash, utils, i18n, Services, Session) {
        'use strict';

        /**
         * @param {Event[]} evs
         * @return {Event[]}
         */
        function order_events(evs) {
            return evs.reverse();
        }

        /**
         * @param {Event[]} evs
         * @return {Event[]}
         */
        function add_special_events(evs) {
            evs.push({
                $never_filter: true,
                $never_expand: true,
                $is_special: true,
                title: i18n.get('company/company_founded'),
                logo: DOMAIN.model.event_props.type.company_created,
                sentiment: DOMAIN.model.event_props.sentiments.neutral,
            });

            return evs;
        }

        /**
         * @param {Event[]} evs
         * @return {Event[]}
         */
        function highlight_most_bookmarked_events(evs) {
            var scores = lodash(evs.concat({ bookmark_count: 1 }))
                .map('bookmark_count')
                .filter()
                .value();

            var high_score = Math.max.apply(Math, scores);
            var high_percent = high_score * 0.9;

            return lodash(evs)
                .map(unhighlight)
                .filter(function (ev) {
                    return ev.bookmark_count >= high_percent;
                })
                .map(highlight)
                .value();
        }

        /**
         * @param {Event} ev
         * @return {Event}
         */
        function highlight(ev) {
            ev.$highlight = true;
            return ev;
        }

        /**
         * @param {Event} ev
         * @return {Event}
         */
        function unhighlight(ev) {
            ev.$highlight = false;
            return ev;
        }

        /**
         * @param {Event} ev
         * @return {Object}
         */
        function visible_event(ev) {
            return {
                id: ev.id,
                title: utils.ellipsis(ev.title, 100),
                date: new Date(ev.date).valueOf(),
                sentiment: ev.sentiment,
                logo: ev.logo,
                tag_ids: lodash.filter(ev.tag_ids),
                source_count: ev.source_count,
                needs_sources: ev.source_count <= 1,
                bookmark_count: ev.bookmark_count,
                bookmarked_by_me: ev.bookmarked_by_user,
            };
        }

        /**
         * @param {String} label
         * @return {String}
         */
        function generate_template_event_content(label) {
            return [
                '<span class="events__event__content events__event__content--', label, ' is-non-selectable"',
                '    ng-click="view(event)">',
                '    <div class="events__event__info">',
                '        <i18n class="events__event__date" date="{{::event.date}}" format="D MMM, YYYY"></i18n>',
                '        <span ng-class="{',
                '                \'imgview--bookmarks\': !event.bookmarked_by_me,',
                '                \'imgview--bookmarked\': event.bookmarked_by_me,',
                '            }"',
                '            ng-click="toggle_favorite($event, event)"',
                '            class="right margin-left-xsmall font-size-small imgview imgview--with-content">{{event.bookmark_count | number}}</span>',
                '        <span class="right font-size-small imgview imgview--with-content imgview--sources">{{::event.source_count | number}}</span>',
                '        <span ng-show="::event.needs_sources" class="right margin-right-small imgview imgview--warning"></span>',
                '    </div>',
                '    <div class="events__event__title copy">{{::event.title}}</div>',
                '</span>',
            ].join('');
        }

        function controller($scope) {
            $scope.vm = {
                first_load: 2,
                selected_event_to_edit: null,
                selected_event_to_view: null,
                event_view_menu: {},
                event_view_form: {},
                event_edit_form: {},
                add_event: {},
                loading: false
            };

            /**
             * @return {Promise}
             */
            $scope.load = function () {
                $scope.vm.loading = true;

                if ($scope.vm.first_load) {
                    $scope.vm.first_load--;
                }

                return Services.query.companies.events.timeline($scope.id, Session.USER.id)
                    .then(lodash.curryRight(lodash.map, 2)(visible_event))
                    .then(lodash.curryRight(lodash.sortBy, 2)('date'))
                    .then(utils.scope.set($scope, 'events'))
                    .then(utils.scope.set($scope, 'filtered_events'))
                    .then(utils.scope.set($scope, 'vm.loading', false))
                    .then(order_events)
                    .then(add_special_events)
                    .then(highlight_most_bookmarked_events)
                    .then(function () {
                        set_filtered_events($scope.filters);
                    });
            };

            /**
             * @param {Event} ev
             * @return {void}
             */
            $scope.edit = function (ev) {
                $scope.vm.selected_event_to_edit = ev;
                $scope.vm.add_event.show();
            };

            /**
             * @param {Event} ev
             * @return {void}
             */
            $scope.view = function (ev) {
                if (ev.$never_expand) {
                    return;
                }

                $scope.vm.selected_event_to_view =
                    $scope.vm.selected_event_to_view === ev ? null : ev;
            };

            /**
             * @return {void}
             */
            $scope.unedit = function () {
                // let the popup hide before unselecting the event
                $timeout(function () {
                    $scope.vm.selected_event_to_edit = null;
                }, 300);
            };

            /**
             * @return {void}
             */
            $scope.report_viewing = function () {
                var ev = $scope.vm.selected_event_to_view;
                $scope.vm.event_view_menu.show = false;
            };

            /**
             * @return {void}
             */
            $scope.edit_viewing = function () {
                var ev = $scope.vm.selected_event_to_view;
                $scope.vm.event_view_menu.show = false;
                $timeout(function () {
                    $scope.edit(ev);
                }, 500);
            };

            /**
             * @param {jQuery.Event} $ev
             * @param {Event} ev
             * @return {Boolean}
             */
            $scope.toggle_favorite = function ($ev, ev) {
                $ev.preventDefault();
                $ev.stopPropagation();

                utils.assert(ev && ev.id);
                utils.assert(Session.USER);
                utils.assert(Session.USER.id);

                if (ev.bookmarked_by_me) {
                    ev.bookmarked_by_me = false;
                    ev.bookmark_count--;

                    Services.query.events.bookmarks.delete(ev.id, Session.USER.id);
                } else {
                    ev.bookmarked_by_me = true;
                    ev.bookmark_count++;

                    Services.query.events.bookmarks.upsert(ev.id, {
                        user_id: Session.USER.id
                    });
                }
            };

            $scope.api = $scope.api || {};
            $scope.api.refresh = $scope.load;

            $scope.$watch('filters', set_filtered_events, true);

            function set_filtered_events(filters) {
                var tag_ids = lodash.map(filters, 'id');

                if (!filters || !filters.length) {
                    $scope.filtered_events = $scope.events;
                } else {
                    $scope.vm.first_load = 0;
                    $scope.filtered_events = lodash.filter($scope.events, function (ev) {
                        if (ev.$never_filter) {
                            return true;
                        } else if (!ev.tag_ids || !ev.tag_ids.length) {
                            return false;
                        }

                        for (var i = 0, len = tag_ids.length; i < len; i++) {
                            if (lodash.includes(ev.tag_ids, tag_ids[i])) {
                                return true;
                            }
                        }
                    });
                }
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                filters: '=',
                api: '=',
                id: '@',
            },
            template: [
                '<div class="events can-load" ng-class="{loading: vm.loading}" ng-init="load()">',
                '    <div class="center-aligned loading__only padding-top-large"',
                '        i18n="common/loading_events" ng-if="vm.first_load"></div>',

                '    <span>',
                '    <div ng-repeat="event in filtered_events" ',
                '        class="events__event" ',
                '        ng-class="{',
                '           \'animated fadeInUp\': vm.first_load,',
                '           \'animated fadeIn\': !vm.first_load,',
                '           \'events__event--highlight\': event.$highlight,',
                '           \'events__event--first\': $first,',
                '           \'events__event--last\': $last,',
                '           \'events__event--special\': event.$is_special,',
                '           \'events__event--selected\': vm.selected_event_to_view === event,',
                '        }" ',
                '        style="animation-delay: {{$index < 10 ? $index * .1 : 1}}s"',
                '    >',

                generate_template_event_content('left'),
                '        <div',
                '            class="events__event__icon events__event__icon--{{::event.sentiment}} events__event__icon--{{::event.logo}}"',
                '            ng-click="view(event)"></div>',
                generate_template_event_content('right'),

                '        <div ng-if="vm.selected_event_to_view === event"',
                '            class="left-align fill-background events__event__view">',
                '            <div class="events__event__edit-menu">',
                '                <span ng-click="vm.event_view_menu.show = true"',
                '                    class="logged-in-only right imgview imgview--dot-dot-dot no-outline"></span>',
                '                <span ng-class="{',
                '                        \'imgview--bookmarks\': !event.bookmarked_by_me,',
                '                        \'imgview--bookmarked\': event.bookmarked_by_me,',
                '                    }"',
                '                    ng-click="toggle_favorite($event, event)"',
                '                    class="right font-size-small imgview margin-right-small">&nbsp;</span>',
                '            </div>',
                '            <event',
                '                type="view"',
                '                id="{{vm.selected_event_to_view.id}}"',
                '                api="vm.event_view_form"',
                '            ></event>',
                '        </div>',

                '    </div>',
                '    </span>',

                '    <popover',
                '        class="left-align"',
                '        anchored',
                '        anchored-element="\'.events__event__edit-menu .imgview--dot-dot-dot\'"',
                '        anchored-show="vm.event_view_menu.show"',
                '        anchored-placement="bottom-right"',
                '        anchored-top-offset="10"',
                '        anchored-left-offset="10"',
                '        anchored-arrow="true"',
                '        anchored-auto-hide="true"',
                '    >',
                '        <popover-item i18n="admin/edit"',
                '            ng-click="edit_viewing()"></popover-item>',
                '        <popover-item i18n="admin/report"',
                '            ng-click="report_viewing()"></popover-item>',
                '    </popover>',

                '    <div ng-if="events.length > 1"',
                '        class="events__line animated fadeIn"></div>',

                '    <popover with-close-x with-backdrop ',
                '        api="vm.add_event" ',
                '        on-close="unedit()" ',
                '        class="popover--with-content left-align" ',
                '    >',
                '        <event',
                '            ng-if="vm.selected_event_to_edit"',
                '            id="{{vm.selected_event_to_edit.id}}"',
                '            api="vm.event_edit_form"',
                '            on-save="load(); vm.add_event.hide(); vm.event_edit_form.reset()"',
                '            on-cancel="vm.event_edit_form.reset(); vm.add_event.hide()"',
                '        ></event>',
                '    </popover>',
                '</div>'
            ].join('')
        };
    }
]);
