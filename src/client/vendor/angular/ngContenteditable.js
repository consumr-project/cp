angular.module('tcp').directive('ngContenteditable', [function () {
    'use strict';

    function link(scope, element, attrs, ngModel) {
        ngModel.$render = function() {
            element.html(ngModel.$viewValue || '');
        };

        element.bind('blur keyup change', function() {
            scope.$apply(function () {
                ngModel.$setViewValue(element.html());
            });
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link,
    };
}]);
