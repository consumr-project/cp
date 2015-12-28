angular.module('tcp').directive('events', [
    '$q',
    'lodash',
    'utils',
    'ServicesService',
    function ($q, lodash, utils, ServicesService) {
        'use strict';

        /**
         * @param {Event} ev
         * @return {Object}
         */
        function visible_event(ev) {
            return {
                id: ev.id,
                title: ev.title,
                date: new Date(ev.date).valueOf(),
                sentiment: ev.sentiment
            };
        }

        /**
         * @param {String} event_id
         * @return {Promise}
         */
        function get_event(event_id) {
            return ServicesService.query.events.retrieve(event_id);
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
                        .pluck('event_id')
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
                '<span class="events__event__content events__event__content--', label, '">',
                '    <table>',
                '        <tr>',
                '            <td>',
                '                <i18n class="events__event__date" date="{{::event.date}}" format="YYYY"></i18n>',
                '            </td>',
                '            <td>',
                '                <span class="events__event__title">{{::event.title}}</span>',
                '            </td>',
                '        </tr>',
                '    </table>',
                '</span>',
            ].join('');
        }

        function controller($scope) {
            get_events($scope.id)
                .then(lodash.curryRight(lodash.map, 2)(visible_event))
                .then(lodash.curryRight(lodash.sortBy, 2)('date'))
                .then(utils.scope.set($scope, 'events'));
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                id: '@',
            },
            template: [
                '<div class="events">',
                '    <div ng-repeat="event in events track by event.id" ',
                '        class="events__event animated fadeInUp" ',
                '        style="animation-delay: {{$index * .1}}s">',

                generate_template_event_content('left'),
                '        <avatar image="/app/elements/avatar/avatar-white.svg" ',
                '            class="key--{{::event.sentiment}}-background"></avatar>',
                generate_template_event_content('right'),

                '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
