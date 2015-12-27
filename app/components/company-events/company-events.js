angular.module('tcp').directive('companyEvents', [
    '$q',
    'lodash',
    'utils',
    'ServicesService',
    function ($q, lodash, utils, ServicesService) {
        'use strict';

        function controller($scope) {
            ServicesService.query.companies.events.retrieve($scope.id).then(function (events) {
                // XXX should be one request
                $q.all(
                    lodash.map(events, function (ev) {
                        return ServicesService.query.events.retrieve(ev.event_id, ['tags', 'sources']);
                    })
                ).then(utils.scope.set($scope, 'events'));
            });
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                id: '@',
            },
            template: [
                '<div>',
                // '    <div ng-repeat="event in events">',
                // '        {{event.title}}',
                // '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
