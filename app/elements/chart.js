/**
 * @attribute {String} type (see TYPE)
 * @attribute {String[]} y-labels list of y-alis labels for (hbar) chart
 * @attribute {Number[]} values list of values for (hbar) chart
 * @attribute {Number} value score/value for (heartcount) chart
 * @attribute {Boolean} editable accepts user inputs
 * @attribute {Function} on-change handler
 */
angular.module('tcp').directive('chart', [
    'i18n',
    'utils',
    'lodash',
    function (i18n, utils, lodash) {
        'use strict';

        var MAX_HBAR_WIDTH = 73;
        var CLASS_HEARTCOUNT_ELEM = '.chart--heartcount__n';
        var DATA_VALUE_BAK = 'cp-value';
        var ATTR_VALUE = 'value';

        var TYPE = {
            hbar: 'hbar',
            heartcount: 'heartcount',
        };

        var TEMPLATE = [
            '<div class="chart" ng-switch="type">',
            '    <div ng-switch-when="heartcount" class="chart--heartcount">',
            '        <div class="chart--heartcount__n chart--heartcount__1"></div>',
            '        <div class="chart--heartcount__n chart--heartcount__2"></div>',
            '        <div class="chart--heartcount__n chart--heartcount__3"></div>',
            '        <div class="chart--heartcount__n chart--heartcount__4"></div>',
            '        <div class="chart--heartcount__n chart--heartcount__5"></div>',
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

        /**
         * @param {Angular.Scope} scope
         * @param {jQuery} elem
         * @param {Angular.Attributes} attrs
         * @return {void}
         */
        function link(scope, elem, attrs) {
            if (utils.truthy(attrs.editable)) {
                switch (attrs.type) {
                case TYPE.heartcount:
                    elem.data(DATA_VALUE_BAK, elem.attr(ATTR_VALUE) || 0);

                    elem.on('mouseleave', CLASS_HEARTCOUNT_ELEM, function (ev) {
                        elem.attr(ATTR_VALUE, elem.data(DATA_VALUE_BAK));
                    });

                    elem.on('mouseover', CLASS_HEARTCOUNT_ELEM, function (ev) {
                        elem.attr(ATTR_VALUE, angular.element(ev.target).index() + 1);
                    });

                    elem.on('click', function (ev) {
                        var value = angular.element(ev.target).index() + 1,
                            old_value = +elem.data(DATA_VALUE_BAK);

                        // this is how you "clear" the chart
                        if (value === 1 && old_value === 1) {
                            value = 0;
                        }

                        elem.attr(ATTR_VALUE, value);
                        elem.data(DATA_VALUE_BAK, value);
                        scope.onChange({value: value});
                    });
                    break;
                }
            }
        }

        return {
            replace: true,
            link: link,
            controller: ['$scope', controller],
            template: TEMPLATE,
            scope: {
                type: '@',
                values: '=',
                yLabels: '=',
                onChange: '&',
            },
        };
    }
]);
