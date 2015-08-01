angular.module('tcp').controller('entryController', [
    '$scope',
    '$routeParams',
    'extract',
    function ($scope, $routeParams, extract) {
        'use strict';

        $scope.entry = {
            article: {
                highlights: [],
                useful_counter: 0
            }
        };

        $scope.highlight = {
            on: null,
            node: null,
        };

        $scope.onFoundUseful = function () {
            $scope.entry.article.useful_counter++;
        };

        $scope.onHighlight = function (args) {
            var highlight = args.highlight;

            $scope.highlight.node = highlight.getHighlightElements()[0];
            $scope.highlight.on = !!$scope.highlight.node;

            $scope.entry.article.highlights.push(highlight);
            $scope.$apply()
        };

        $scope.onHighlightClick = function (args) {
            var highlight = args.highlight;
            console.log(highlight);
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

        $scope.entry.article.external_url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';
    }
]);
