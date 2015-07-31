angular.module('tcp').controller('entryController', [
    '$scope',
    '$routeParams',
    'extract',
    function ($scope, $routeParams, extract) {
        'use strict';

        $scope.entry = {
            article: {}
        };

        $scope.highlighterOnHighlight = function (args) {
            var highlight = args.highlight;
            console.log(highlight);
        };

        $scope.highlighterOnHighlightClick = function (args) {
            var highlight = args.highlight,
                target = args.target;

            console.log(highlight, target);
        };

        $scope.$watch('entry.article.external_url', function (url) {
            if (!url) {
                return;
            }

            // XXX catch
            // XXX error state
            extract.fetch(url).then(function (article) {
                if (!article || !article.ok) {
                    return;
                }

                $scope.entry.article.$contentParts = article.content_parts;
                $scope.entry.article.content = article.content;
                $scope.entry.article.images = article.images;
                $scope.entry.article.external_url = article.source;
                $scope.entry.article.title = article.title;
                $scope.$apply();
            });
        });

        $scope.entry.article.url = '';
        $scope.entry.article.highlights = [1, 2, 3, 4, 5, 6];
        $scope.entry.article.useful_counter = 15;
    }
]);
