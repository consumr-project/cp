angular.module('tcp').directive('events', [
    'DOMAIN',
    '$q',
    '$timeout',
    'lodash',
    'utils',
    'i18n',
    'ServicesService',
    'SessionService',
    function (DOMAIN, $q, $timeout, lodash, utils, i18n, ServicesService, SessionService) {
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
            var best_scores = lodash(evs)
                .map('bookmark_count')
                .uniq()
                .filter()
                .sortBy()
                .reverse()
                .value()
                .shift();

            return lodash(evs)
                .map(unhighlight)
                .filter(['bookmark_count', best_scores])
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
                source_count: ev.sources.length,
                bookmark_count: ev.bookmarks['@meta'].instead.count,
                bookmarked_by_me: ev.bookmarks['@meta'].instead.includes_me,
            };
        }

        /**
         * @param {String} event_id
         * @return {Promise}
         */
        function get_event(event_id) {
            return ServicesService.query.events.retrieve(event_id, ['sources', 'bookmarks']);
        }

        /**
         * XXX should be one request
         * @param {String} company_id
         * @return {Promise}
         */
        function get_events(company_id) {
            return ServicesService.query.companies.events.retrieve(company_id).then(function (events) {
                return $q.all(
                    lodash
                        .chain(events)
                        .map('event_id')
                        .map(get_event)
                        .value()
                );
            });
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
                '        <span ng-class="{\'events__event__meta--bookmarked\': event.bookmarked_by_me}"',
                '            ng-click="toggle_favorite($event, event)"',
                '            class="events__event__meta events__event__meta--bookmarks">{{event.bookmark_count | number}}</span>',
                '        <span class="events__event__meta events__event__meta--sources">{{::event.source_count | number}}</span>',
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

                return get_events($scope.id)
                    .then(lodash.curryRight(lodash.map, 2)(visible_event))
                    .then(lodash.curryRight(lodash.sortBy, 2)('date'))
                    .then(utils.scope.set($scope, 'events'))
                    .then(utils.scope.set($scope, 'vm.loading', false))
                    .then(order_events)
                    .then(add_special_events)
                    .then(highlight_most_bookmarked_events);
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
             * @param {jQuery.Event} $ev
             * @param {Event} ev
             * @return {Boolean}
             */
            $scope.toggle_favorite = function ($ev, ev) {
                $ev.preventDefault();
                $ev.stopPropagation();

                utils.assert(ev && ev.id);
                utils.assert(SessionService.USER);

                if (ev.bookmarked_by_me) {
                    ev.bookmarked_by_me = false;
                    ev.bookmark_count--;

                    ServicesService.query.events.bookmarks.delete(ev.id, SessionService.USER.id);
                } else {
                    ev.bookmarked_by_me = true;
                    ev.bookmark_count++;

                    ServicesService.query.events.bookmarks.upsert(ev.id, {
                        user_id: SessionService.USER.id
                    });
                }
            };

            $scope.api = $scope.api || {};
            $scope.api.refresh = $scope.load;
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                api: '=',
                id: '@',
            },
            template: [
                '<div class="events can-load" ng-class="{loading: vm.loading}" ng-init="load()">',
                '    <div class="center-aligned loading__only padding-top-large"',
                '        i18n="common/loading_events" ng-if="vm.first_load"></div>',

                '    <span>',
                '    <div ng-repeat="event in events" ',
                '        class="events__event fadeInUp" ',
                '        ng-class="{',
                '           \'animated\': vm.first_load,',
                '           \'events__event--highlight\': event.$highlight,',
                '           \'events__event--first\': $first,',
                '           \'events__event--last\': $last,',
                '           \'events__event--selected\': vm.selected_event_to_view === event,',
                '        }" ',
                '        style="animation-delay: {{$index < 10 ? $index * .1 : 1}}s"',
                '    >',

                generate_template_event_content('left'),
                '        <div',
                '            class="events__event__icon events__event__icon--{{::event.sentiment}} events__event__icon--{{::event.logo}}"',
                '            ng-click="view(event)"></div>',
                generate_template_event_content('right'),

                '        <event',
                '            ng-if="vm.selected_event_to_view === event"',
                '            type="view"',
                '            id="{{vm.selected_event_to_view.id}}"',
                '            api="vm.event_view_form"',
                '            class="left-align fill-background animated fadeIn"',
                '        ></event>',

                '    </div>',
                '    </span>',

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
