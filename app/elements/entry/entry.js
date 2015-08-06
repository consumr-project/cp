angular.module('tcp').directive('entry', function () {
    'use strict';

    return {
        replace: true,
        templateUrl: '/app/elements/entry/entry.html',
        scope: {
            highlighterApi: '=',
            onFoundUseful: '&',
            onHighlight: '&',
            onHighlightClick: '&',
            onNonHighlightClick: '&',
            model: '='
        },
        link: function (scope, elem, attr) {
            scope.is_summary = attr.summary;
            scope.is_full = !attr.summary;
            elem.addClass('entry--' + (attr.summary ? 'summary' : 'full'));
            elem.addClass('entry--' + attr.type);
        },
        controller: ['$scope', function ($scope) {
            $scope.header_image = '';

            if (!$scope.model.html) {
                $scope.header_image = $scope.model.images && $scope.model.images.length ?
                    $scope.model.images[0] : $scope.model.src;
            }

            $scope.selectHeaderImage = function (image) {
                $scope.header_image = image;
            };
        }]
    };
});
