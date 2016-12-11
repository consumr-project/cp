/**
 * @attribute {Boolean} autoSelect automatically set today's date
 */
angular.module('tcp').directive('datepicker', [
    '$parse',
    'lodash',
    'i18n',
    function ($parse, lodash, i18n) {
        'use strict';

        var MONTH = 'Month',
            DATE = 'Date',
            YEAR = 'FullYear';

        /**
         * @param {number} val
         * @param {number} [plus]
         * @return {Object}
         */
        function option(val, plus) {
            plus = plus || 0;
            return {
                id: val,
                label: val + plus,
            };
        }

        /**
         * @param {Object} holder
         * @param {Date} date
         */
        function set_date(holder, date) {
            holder.month = option(date.getMonth(), 1);
            holder.day = option(date.getDate());
            holder.year = option(date.getFullYear());
        }

        /**
         * @param {Date} date
         * @param {option} option {@see #option}
         * @param {MONTH|DATE|YEAR} type
         */
        function set_option(date, option, type) {
            if (date && option) {
                date['set' + type](option.id);
            }
        }

        return {
            replace: true,
            restrict: 'E',
            require: '?ngModel',
            scope: true,
            controller: ['$scope', '$attrs', function ($scope, $attrs) {
                var now = new Date(),
                    getter = $parse($attrs.ngModel);

                $scope.vm = {
                    months: lodash.map(lodash.range(0, 12), function (val) {
                        var opt = option(val, 1);
                        opt.label = i18n.get('common/month_' + opt.label);
                        return opt;
                    }),
                    days: lodash.map(lodash.range(1, 32), function (val) {
                        var opt = option(val);
                        opt.label = i18n.get('common/ordinal', { count: opt.label });
                        return opt;
                    }),
                    years: lodash.map(lodash.range(1900, now.getFullYear() + 1), function (val) {
                        return option(val);
                    }),

                    month: null,
                    day: null,
                    year: null,
                };

                if ($attrs.autoSelect === 'true') {
                    set_date($scope.vm, now);
                }

                $scope.$watch($attrs.ngModel, function (new_date) {
                    if (new_date) {
                        set_option(getter($scope), option(new_date.getMonth()), MONTH);
                        set_option(getter($scope), option(new_date.getDate()), DATE);
                        set_option(getter($scope), option(new_date.getFullYear()), YEAR);
                        set_date($scope.vm, new_date);
                    }
                }, true);

                $scope.$watch('vm.month', function (val) {
                    set_option(getter($scope), val, MONTH);
                });

                $scope.$watch('vm.day', function (val) {
                    set_option(getter($scope), val, DATE);
                });

                $scope.$watch('vm.year', function (val) {
                    set_option(getter($scope), val, YEAR);
                });
            }],
            template: [
                '<div class="is-non-selectable no-outline form__fields">',
                    '<select-wrapper>',
                        '<select ng-options="item as item.label for item in vm.months track by item.id" ',
                            'ng-model="vm.month">',
                            '<option disabled="true" i18n="common/month"></option>',
                        '</select>',
                    '</select-wrapper>',
                    '<select-wrapper>',
                        '<select ng-options="item as item.label for item in vm.days track by item.id" ',
                            'ng-model="vm.day">',
                            '<option disabled="true" i18n="common/day"></option>',
                        '</select>',
                    '</select-wrapper>',
                    '<select-wrapper>',
                        '<select ng-options="item as item.label for item in vm.years track by item.id" ',
                            'ng-model="vm.year">',
                            '<option disabled="true" i18n="common/year"></option>',
                        '</select>',
                    '</select-wrapper>',
                '</div>',
            ].join(''),
        };
    }
]);
