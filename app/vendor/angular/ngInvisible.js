angular.module('tcp').directive('ngInvisible', [function() {
    'use strict';

    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ngInvisible, function (val) {
                element.css('visibility', val ? 'hidden' : 'visible');
            }, true);
        }
    };
}]);
