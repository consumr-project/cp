/**
 * @attribute {String} type (see TYPE)
 */
angular.module('tcp').directive('chart', [
    'i18n',
    'lodash',
    function (i18n, lodash) {
        'use strict';

        var TYPE = {
            hbar: 'hbar',
        };

        /**
         * @param {Number} a
         * @param {Number} b
         * @return {Number}
         */
        function sum(a, b) {
            return a + b;
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {void}
         */
        function controller($scope) {
            $scope.calc_per = function (val) {
                return Math.round(val / lodash.reduce($scope.values, sum, 0) * 100);
            };

            $scope.per_label = function (num) {
                return i18n.get('common/percentage', {
                    num: num
                });
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            scope: {
                type: '@',
                values: '=',
                yLabels: '=',
            },
            template: [
                '<div class="chart" ng-switch="type">',
                '    <div ng-switch-when="hbar" class="chart--hbar">',
                '        <div ng-repeat="value in ::values" class="chart__row">',
                '            <span class="chart__label">{{yLabels[$index]}}</span>',
                '            <span class="chart__bar" style="width: {{calc_per(value) * 4}}px"></span>',
                '            <span class="chart__value">{{per_label(calc_per(value))}}</span>',
                '        </div>',
                '    </div>',
                '</div>'
            ].join('')
        };
    }
]);
