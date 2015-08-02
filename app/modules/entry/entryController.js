angular.module('tcp').controller('entryController', [
    '$scope',
    '$routeParams',
    '$sce',
    'extract',
    function ($scope, $routeParams, $sce, extract) {
        'use strict';

        $scope.entry = {
            url: '',

            is_article: false,
            is_photo: false,
            is_video: false,

            article: {},
            photo: {},
            video: {}
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
            $scope.entry.is_photo = false;
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
            $scope.entry.article.useful_counter++;
            $scope.entry.photo.useful_counter++;
            $scope.entry.video.useful_counter++;
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

        $scope.$watch('entry.url', function (url) {
            if (!url) {
                return;
            }

            resetEntry();

            // XXX error state
            // XXX loading state
            extract.fetch(url).then(function (article) {
                var entry_key;

                if (!article) {
                    return;
                }

                switch (article.media.type) {
                    case extract.TYPE_VIDEO:
                        entry_key = 'video';
                        $scope.entry.is_video = true;
                        $scope.entry.video.html = $sce.trustAsHtml(article.media.html);
                        break;

                    case extract.TYPE_PHOTO:
                        entry_key = 'photo';
                        $scope.entry.is_photo = true;
                        $scope.entry.photo.src= article.media.url;
                        break;

                    case extract.TYPE_ARTICLE:
                    default:
                        entry_key = 'article';
                        $scope.entry.is_article = true;
                        $scope.entry.article.highlights = [];
                        $scope.entry.article.images = article.images;
                        $scope.entry.article.keywords = article.keywords;
                        break;
                }

                $scope.entry[entry_key].authors = article.authors;
                $scope.entry[entry_key].content = article.content;
                $scope.entry[entry_key].contentParts = article.contentParts;
                $scope.entry[entry_key].description = article.description;
                $scope.entry[entry_key].external_url = article.url;
                $scope.entry[entry_key].release_date = new Date(article.published);
                $scope.entry[entry_key].source_display = article.provider_display;
                $scope.entry[entry_key].source_name = article.provider_name;
                $scope.entry[entry_key].title = article.title;
                $scope.entry[entry_key].useful_counter = 0;

                $scope.$apply();
            });
        });

        $scope.entry.url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';
        $scope.entry.url = 'http://www.bbc.com/news/world-europe-33739851';
        $scope.entry.url = 'https://www.flickr.com/photos/mr3zo00oz/5584870916/in/photolist-9vvVxS-deQWpH-2ND7vr-5Hrfq8-5Jj57H-6yN5T6-7fyLU-pGzmVp-5B37Zu-fvsdww-5iMEmH-73nCZt-aMk7cR-6FkUha-7pSZRU-78TdxQ-bvLqxJ-AxVud-aTPSxk-9yn9Xp-4BUac-g2ZTRu-deQWmG-bs8WbE-fbdcog-kEN49s-5TT6vV-6dGGZk-aDHn3j-4y1sXk-8rEgN-2S8gVd-6dvtQC-4rfZ8h-5tJpnw-4exoM6-7adYrP-6NX4em-8nDsgD-8QwTKz-cdPiKU-7DM9jj-o3Essy-54v7jN-mdtBdy-deQWkH-sm1k2-bfpAEe-6fubgq-7X5CfS';
        $scope.entry.url = 'http://imgur.com/gallery/lQBqnIa';
        $scope.entry.url = 'https://vimeo.com/channels/staffpicks/133217402';
        $scope.entry.url = 'https://www.youtube.com/watch?v=pDVmldTurqk';
    }
]);
