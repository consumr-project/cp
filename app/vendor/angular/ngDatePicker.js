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
        date = date || new Date();
        return [
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

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs) {
            var date;

            if (has_native_date_picker(element)) {
                return;
            }

            date = scope.$eval(attrs.ngModel);

            // use internal jquery which has bootstrap-datepicker
            element = $(element).attr('type', 'text');
            setTimeout(function () {
            element.val(parse_date(date))
            element.datepicker(build_options(scope, attrs));
            element.change(update_model(scope, date));
            },10);
        }
    };
}]);
