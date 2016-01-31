/**
 * @link http://felicegattuso.com/projects/datedropper
 */
angular.module('tcp').directive('ngDatePicker', function() {
    'use strict';

    /**
     * @return {Object}
     */
    function get_options() {
        return {
            animate_current: false,
            animation: 'dropDown',
            borderColor: '#cecece',
            boxShadow: '0 0px 0px 3px rgba(0,0,0,0.05)',
            color: '#27b8e8',
            format: 'Y-m-d',
            lang: 'en',
        };
    }

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs) {
            element
                .attr('type', 'text')
                .dateDropper(get_options());

            scope.$on('$destroy', function () {
                element.dateDropper('remove');
            });
        }
    };
});
