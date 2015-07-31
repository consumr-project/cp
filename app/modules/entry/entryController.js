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
                if (!article) {
                    return;
                }

                $scope.entry.article.external_url = article.url;
                $scope.entry.article.release_date = new Date(article.published);
                $scope.entry.article.source = article.provider_url || article.provider_name;
                $scope.entry.article.title = article.title;
                $scope.entry.article.description = article.description;
                $scope.entry.article.images = article.images;
                $scope.entry.article.content = article.content;
                $scope.entry.article.contentParts = article.contentParts;
                $scope.entry.article.keywords = article.keywords;

                $scope.$apply();
            });
        });

        $scope.entry.article.url = '';
        $scope.entry.article.highlights = [1, 2, 3, 4, 5, 6];
        $scope.entry.article.useful_counter = 15;
    }
]);
