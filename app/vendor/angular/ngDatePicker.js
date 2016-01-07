/**
 * @link http://eternicode.github.io/bootstrap-datepicker
 */
angular.module('tcp').directive('ngDatePicker', ['$parse', 'jQuery', function($parse, $) {
    'use strict';

    /**
     * @param {jQuery} element
     * @return {Boolean}
     */
    function has_native_date_picker(element) {
        return 0;
        return element.prop('type') === 'date';
    }

    /**
     * @param {Number} num
     * @return {String}
     */
    function pad(num) {
        return num < 10 ? '0' + num : num;
    }

    /**
     * @param {Date} [date]
     * @return {String}
     */
    function parse_date(date) {
        return !date ? '' : [
            pad(date.getMonth() + 1),
            pad(date.getDate()),
            date.getFullYear()
        ].join('/');
    }

    /**
     * @param {angular.Scope} scope
     * @param {angular.Attributes} attrs
     * @return {Object}
     */
    function build_options(scope, attrs) {
        return {
            format: 'mm/dd/yyyy',
            autoclose: true
        };
    }

    /**
     * @param {angular.Scope} scope
     * @param {Date} date
     * @return {Function}
     */
    function update_model(scope, date) {
        return function () {
            var new_date = new Date(this.value);

            setTimeout(function () {
                date.setFullYear(new_date.getFullYear());
                date.setMonth(new_date.getMonth());
                date.setDate(new_date.getDate());

                scope.$apply();
            }, 10);
        };
    }

    /**
     * @param {jQuery} element
     * @param {Date} date
     */
    function set_field_value(element, date) {
        setTimeout(function () {
            element.val(is_valid(date) ? parse_date(date) : '');
        }, 10);
    }

    /**
     * @param {Date} date
     * @return {Boolean}
     */
    function is_valid(date) {
        return date && !isNaN(date.getTime());
    }

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs) {
            var date;

            if (has_native_date_picker(element)) {
                return;
            }

            date = scope.$eval(attrs.ngModel);
            set_field_value(element, date);

            // use internal jquery which has bootstrap-datepicker
            element = $(element).attr('type', 'text');
            element.datepicker(build_options(scope, attrs));

            element.change(update_model(scope, date || new Date()));
            scope.$watch(attrs.ngModel, set_field_value.bind(null, element));
        }
    };
}]);
