/**
 * @attribute {String} type (see TYPE)
 */
angular.module('tcp').directive('chart', [
    'i18n',
    'lodash',
    function (i18n, lodash) {
        'use strict';

        var TEMPLATE = [
            '<div class="chart" ng-switch="type">',
            '    <div ng-switch-when="hbar" class="chart--hbar">',
            '        <div ng-repeat="value in ::values" class="chart__row">',
            '            <span class="chart__label">{{yLabels[$index]}}</span>',
            '            <span class="chart__bar" ng-style="hbar_styles(value)"></span>',
            '            <span class="chart__value">{{per_label(calc_per(value))}}</span>',
            '        </div>',
            '    </div>',
            '</div>'
        ].join('');

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
            /**
             * @param {Number} val
             * @return {Number}
             */
            $scope.calc_per = function (val) {
                return Math.round(val / lodash.reduce($scope.values, sum, 0) * 100);
            };

            /**
             * @param {Number} val
             * @return {Object}
             */
            $scope.hbar_styles = function (val) {
                return {
                    width: $scope.calc_per(val) * 4 + 'px'
                };
            };

            /**
             * @param {Number} val
             * @return {String}
             */
            $scope.per_label = function (num) {
                return i18n.get('common/percentage', {
                    num: num
                });
            };
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: TEMPLATE,
            scope: {
                type: '@',
                values: '=',
                yLabels: '=',
            },
        };
    }
]);
