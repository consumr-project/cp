angular.module('tcp').controller('entryController', [
    '$scope',
    '$routeParams',
    '$sce',
    'extract',
    function ($scope, $routeParams, $sce, extract) {
        'use strict';

        $scope.entry = resetEntry();

        $scope.type = {
            article: extract.TYPE_ARTICLE,
            error: extract.TYPE_ERROR,
            photo: extract.TYPE_PHOTO,
            rich: extract.TYPE_RICH,
            video: extract.TYPE_VIDEO
        };

        $scope.highlight = {
            on: null,
            node: null,
            current: null,
            api: {}
        };

        /**
         * @param {Object} [content]
         * @return {Object}
         */
        function populateError(content) {
            $scope.entry.ok = false;
            $scope.entry.type = extract.TYPE_ERROR;
            $scope.entry.error_code = content.error_code;
            $scope.entry.error_message = content.error_message;
            return $scope.entry;
        }

        /**
         * @param {Object} content
         * @return {Object}
         */
        function populateEntry(content) {
            $scope.entry.ok = true;
            $scope.entry.authors = content.authors;
            $scope.entry.content = content.content;
            $scope.entry.contentParts = content.contentParts;
            $scope.entry.description = content.description;
            $scope.entry.external_url = content.url;
            $scope.entry.highlights = [];
            $scope.entry.html = $sce.trustAsHtml(content.media.html);
            $scope.entry.images = content.images;
            $scope.entry.keywords = content.keywords;
            $scope.entry.release_date = content.published ? new Date(content.published) : null;
            $scope.entry.source_display = content.provider_display;
            $scope.entry.source_name = content.provider_name;
            $scope.entry.src = content.media.url;
            $scope.entry.title = content.title;
            $scope.entry.type = content.media.type || extract.TYPE_ARTICLE;
            $scope.entry.useful_counter = 0;
            return $scope.entry;
        }

        /**
         * @return {Object}
         */
        function resetEntry() {
            $scope.entry = {
                url: $scope.entry ? $scope.entry.url : ''
            };

            return $scope.entry;
        }

        /**
         * @param {Highlight} highlight
         */
        function keepHighlight(highlight) {
            $scope.entry.highlights.push(highlight);
        }

        /**
         * @param {Highlight} highlight
         */
        function unkeepHighlight(highlight) {
            var offset = $scope.entry.highlights.indexOf(highlight);

            if (offset !== -1) {
                $scope.entry.highlights.splice(offset, 1);
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
            $scope.entry.useful_counter++;
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

            // XXX full error state
            // XXX loading state
            extract.fetch(url).then(function (content) {
                if (!content || content.type === extract.TYPE_ERROR) {
                    populateError(content);
                } else {
                    populateEntry(content);
                }

                $scope.$apply();
            });
        });

        $scope.entry.url = 'bad-url';
        $scope.entry.url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';
        $scope.entry.url = 'http://www.bbc.com/news/world-europe-33739851';
        $scope.entry.url = 'https://www.flickr.com/photos/mr3zo00oz/5584870916/in/photolist-9vvVxS-deQWpH-2ND7vr-5Hrfq8-5Jj57H-6yN5T6-7fyLU-pGzmVp-5B37Zu-fvsdww-5iMEmH-73nCZt-aMk7cR-6FkUha-7pSZRU-78TdxQ-bvLqxJ-AxVud-aTPSxk-9yn9Xp-4BUac-g2ZTRu-deQWmG-bs8WbE-fbdcog-kEN49s-5TT6vV-6dGGZk-aDHn3j-4y1sXk-8rEgN-2S8gVd-6dvtQC-4rfZ8h-5tJpnw-4exoM6-7adYrP-6NX4em-8nDsgD-8QwTKz-cdPiKU-7DM9jj-o3Essy-54v7jN-mdtBdy-deQWkH-sm1k2-bfpAEe-6fubgq-7X5CfS';
        $scope.entry.url = 'http://imgur.com/gallery/lQBqnIa';
        $scope.entry.url = 'https://vimeo.com/channels/staffpicks/133217402';
        $scope.entry.url = 'https://www.youtube.com/watch?v=pDVmldTurqk';
        // $scope.entry.url = 'https://www.oasis-open.org/spectools/docs/wd-spectools-word-sample-04.doc';
        // $scope.entry.url = 'http://video.ch9.ms/build/2011/slides/TOOL-532T_Sutter.pptx';
        // $scope.entry.url = 'http://newteach.pbworks.com/f/ele+newsletter.docx';
        // $scope.entry.url = 'http://learn.bankofamerica.com/content/excel/Wedding_Budget_Planner_Spreadsheet.xlsx';
        // $scope.entry.url = 'https://bitcoin.org/bitcoin.pdf';
    }
]);
