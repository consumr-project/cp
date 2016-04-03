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
            '    <div ng-switch-when="heartcount" class="chart--heartcout chart--heartcout-{{value}}">',
            '        <div class="chart--heartcout__left"></div>',
            '        <div class="chart--heartcout__right"></div>',
            '    </div>',
            '    <div ng-switch-when="hbar" class="chart--hbar">',
            '        <table>',
            '            <tr ng-repeat="label in ::yLabels">',
            '                <td class="chart__label">{{label}}</td>',
            '                <td>',
            '                    <span class="chart__bar" ng-style="hbar_styles(values[$index])"></span>',
            '                    <span class="chart__value">{{per_label(calc_per(values[$index]))}}</span>',
            '                </td>',
            '            </tr>',
            '        </table>',
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
                return !val ? 0 : Math.round(val / lodash.reduce($scope.values, sum, 0) * 100);
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
                value: '=',
                values: '=',
                yLabels: '=',
            },
        };
    }
]);
