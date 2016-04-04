/**
 * @attribute {String} type (hbar, heartcount)
 */
angular.module('tcp').directive('chart', [
    'i18n',
    'lodash',
    function (i18n, lodash) {
        'use strict';

        var MAX_HBAR_WIDTH = 73;

        var TEMPLATE = [
            '<div class="chart" ng-switch="type">',
            '    <div ng-switch-when="heartcount" class="chart--heartcount chart--heartcount-{{value}}">',
            '        <div class="chart--heartcount__left"></div>',
            '        <div class="chart--heartcount__right"></div>',
            '    </div>',
            '    <div ng-switch-when="hbar" class="chart--hbar">',
            '        <table>',
            '            <tr ng-repeat="label in ::yLabels">',
            '                <td class="chart__label no-wrap">{{label}}</td>',
            '                <td class="no-wrap full-span">',
            '                    <span class="chart__bar" ng-style="hbar_styles(values[$index])"></span>',
            '                    <span class="chart__value">{{per_label(calc_per(values[$index]))}}</span>',
            '                </td>',
            '            </tr>',
            '        </table>',
            '    </div>',
            '</div>'
        ].join('');

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
                return !val ? 0 : Math.round(val / lodash.reduce($scope.values, sum, 0) * 100);
            };

            /**
             * @param {Number} val
             * @return {Object}
             */
            $scope.hbar_styles = function (val) {
                return {
                    width: val / max_value() * MAX_HBAR_WIDTH + '%'
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

            /**
             * @return {Number}
             */
            function max_value() {
                return Math.max.apply(Math, $scope.values);
            }
        }

        return {
            replace: true,
            controller: ['$scope', controller],
            template: TEMPLATE,
            scope: {
                type: '@',
                value: '=',
                values: '=',
                yLabels: '=',
            },
        };
    }
]);
