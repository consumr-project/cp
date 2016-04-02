angular.module('tcp').directive('reviews', [
    'lodash',
    'utils',
    'i18n',
    'Services',
    'Session',
    function (lodash, utils, i18n, Services, Session) {
        'use strict';

        /**
         * @return {String[]}
         */
        function get_chart_labels() {
            return lodash.times(5, function (count) {
                return i18n.get('common/heart_count', { count: count + 1 });
            }).reverse();
        }

        function controller($scope) {
            $scope.reviews = {};

            $scope.vm = {
                chart_labels: get_chart_labels()
            };

            Services.query.companies.reviews.summary($scope.companyId)
                .then(utils.scope.set($scope, 'reviews.summary'));
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                companyId: '@'
            },
            template: [
                '<div>',
                '    <chart type="hbar" values="reviews.summary"',
                '        y-labels="vm.chart_labels"></chart>',
                '</div>'
            ].join('')
        };
    }
]);
