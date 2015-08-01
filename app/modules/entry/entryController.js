angular.module('tcp').controller('entryController', [
    '$scope',
    '$routeParams',
    '$sce',
    'extract',
    function ($scope, $routeParams, $sce, extract) {
        'use strict';

        $scope.entry = {
            is_article: false,
            is_video: false,
            video: {},
            article: {}
        };

        $scope.highlight = {
            on: null,
            node: null,
            current: null,
            api: {}
        };

        function resetEntry() {
            $scope.entry.is_article = false;
            $scope.entry.is_video = false;
        }

        /**
         * @param {Highlight} highlight
         */
        function keepHighlight(highlight) {
            $scope.entry.article.highlights.push(highlight);
        }

        /**
         * @param {Highlight} highlight
         */
        function unkeepHighlight(highlight) {
            var offset = $scope.entry.article.highlights.indexOf(highlight);

            if (offset !== -1) {
                $scope.entry.article.highlights.splice(offset, 1);
            }
        }

        /**
         * @param {Boolean} [run_apply] (default: true)
         */
        $scope.cleanHighlightState = function (run_apply) {
            if ($scope.highlight.current) {
                $scope.highlight.api.remove($scope.highlight.current);
            }

            $scope.highlight.editing = null;
            $scope.highlight.current = null;
            $scope.highlight.node = null;
            $scope.highlight.on = null;

            if (run_apply !== false) {
                $scope.$apply();
            }
        };

        $scope.removeHighlight = function () {
            if ($scope.highlight.editing) {
                $scope.highlight.api.remove($scope.highlight.editing);
                unkeepHighlight($scope.highlight.editing);
            }

            $scope.cleanHighlightState(false);
        };

        $scope.saveHighlight = function () {
            if ($scope.highlight.current) {
                keepHighlight($scope.highlight.current);
                $scope.highlight.current = null;
            }

            $scope.cleanHighlightState(false);
        };

        $scope.onFoundUseful = function () {
            $scope.entry.video.useful_counter++;
            $scope.entry.article.useful_counter++;
        };

        $scope.onHighlight = function (args) {
            var highlight = args.highlight;

            $scope.cleanHighlightState();

            $scope.highlight.current = highlight;
            $scope.highlight.node = highlight.getHighlightElements()[0];
            $scope.highlight.on = !!$scope.highlight.node;

            $scope.$apply();
        };

        $scope.onHighlightClick = function (args) {
            var highlight = args.highlight;

            $scope.cleanHighlightState();

            $scope.highlight.editing = highlight;
            $scope.highlight.node = highlight.getHighlightElements()[0];
            $scope.highlight.on = !!$scope.highlight.node;

            $scope.$apply();
        };

        $scope.$watch('entry.article.external_url', function (url) {
            if (!url) {
                return;
            }

            resetEntry();

            // XXX catch
            // XXX error state
            extract.fetch(url).then(function (article) {
                var entry_key;

                if (!article) {
                    return;
                }

                switch (article.media.type) {
                    case 'video':
                        entry_key = 'video';
                        $scope.entry.is_video = true;
                        $scope.entry.video.html = $sce.trustAsHtml(article.media.html);
                        break;

                    default:
                        entry_key = 'article';
                        $scope.entry.is_article = true;
                        $scope.entry.article.highlights = [];
                        $scope.entry.article.images = article.images;
                        $scope.entry.article.keywords = article.keywords;
                        break;
                }

                $scope.entry[entry_key].content = article.content;
                $scope.entry[entry_key].contentParts = article.contentParts;
                $scope.entry[entry_key].description = article.description;
                $scope.entry[entry_key].external_url = article.url;
                $scope.entry[entry_key].release_date = new Date(article.published);
                $scope.entry[entry_key].source = article.provider_url;
                $scope.entry[entry_key].title = article.title;
                $scope.entry[entry_key].useful_counter = 0;

                $scope.$apply();
            });
        });

        $scope.entry.article.external_url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';
        $scope.entry.article.external_url = 'http://www.bbc.com/news/world-europe-33739851';
        $scope.entry.article.external_url = 'https://vimeo.com/channels/staffpicks/133217402';
        $scope.entry.article.external_url = 'https://www.youtube.com/watch?v=pDVmldTurqk';
    }
]);
