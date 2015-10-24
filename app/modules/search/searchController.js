angular.module('tcp').controller('searchController', [
    '$scope',
    '$routeParams',
    'NavigationService',
    function ($scope, $routeParams, NavigationService) {
        'use strict';

        $scope.query = $routeParams.q;

        /**
         * @param {String} query
         * @param {jQuery.Event} [ev]
         */
        $scope.search = function (query, ev) {
            if (!query && ev && ev.target && ev.target.elements && ev.target.elements.q) {
                query = ev.target.elements.q.value;
            }

            NavigationService.search(query);

            if (ev) {
                ev.preventDefault();
            }
        };

        $scope.$watch('query', function () {
            if ($scope.query) {
                $scope.search($scope.query);
            }
        });
    }
]);


angular.module('tcp').directive('ngFocus', ['$timeout', function($timeout) {
    return {
        link: function ( scope, element, attrs ) {
            scope.$watch( attrs.ngFocus, function ( val ) {
                if ( angular.isDefined( val ) && val ) {
                    $timeout( function () { element[0].focus(); } );
                }
            }, true);

            element.bind('blur', function () {
                if ( angular.isDefined( attrs.ngFocusLost ) ) {
                    scope.$apply( attrs.ngFocusLost );

                }
            });
        }
    };
}]);
