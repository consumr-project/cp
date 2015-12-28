angular.module('tcp').directive('companyEvents', [
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
            return ServicesService.query.events.retrieve(event_id, ['tags', 'sources']);
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
                '<div>',
                '    <div ng-repeat="event in events track by event.id" class="events__event events__event--sentiment-{{::event.sentiment}}">',
                '        <span class="events__event__right">',
                '            <i18n date="{{::event.date}}" format="MMM YYYY"></i18n>',
                '            <span>{{::event.title}}</span>',
                '        </span>',
                '        <span></span>',
                '        <span class="events__event__left">',
                '            <i18n date="{{::event.date}}" format="MMM YYYY"></i18n>',
                '            <span>{{::event.title}}</span>',
                '        </span>',
                '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
