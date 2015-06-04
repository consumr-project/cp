angular.module('tcp').controller('postController', [
    '$scope',
    '$window',
    '$timeout',
    'postService',
    'extract',
    'lodash',
    function ($scope, $window, $timeout, postService, extract, _) {
        'use strict';

        var highlighter;

        $scope.loading = false;
        $scope.editing = true;

        $scope.availalbePostWays = [
            {
                id: 1,
                label: 'Positive'
            },
            {
                id: 2,
                label: 'Negative'
            }
        ];

        function clear() {
            $scope.selection = null;
            $scope.selectionAnchor = null;

            $timeout(function () {
                $scope.selectionData = null;
            });
        }

        /**
         * generate a highlights storage key
         * @return {String}
         */
        function key() {
            return 'hi-' + $scope.url;
        }

        /**
         * @return {Boolean}
         */
        function cacheHighlights() {
            localStorage.setItem(key(), postService.serializeHighlights(highlighter));
            return localStorage.hasOwnProperty(key());
        }

        /**
         * @return {Boolean}
         */
        function restoreCachedHighlights() {
            var highlights = localStorage.getItem(key());

            // XXX
            if (!highlights) {
                highlights = '[{"id":2,"start":769,"end":1116,"type":"highlight","tag":1,"way":1},{"id":3,"start":529,"end":614,"type":"highlight","tag":3,"way":2}]';
            }

            if (highlights) {
                highlighter.deserialize(postService.deserializeHighlights(highlighter, highlights));

                // populate highlights with tag and way info
                _.each(JSON.parse(highlights), function (hi) {
                    _.where(highlighter.highlights, { id: hi.id }).forEach(function (highlight) {
                        highlight.$tag = hi.tag;
                        highlight.$way = hi.way;
                    });
                });
            }

            return !!highlights;
        }

        /**
         * @param {rangy.Highlight} selection
         */
        function showSelection(selection) {
            var tag, way;

            if (!selection) {
                return;
            }

            tag = _.find($scope.availalbePostTags, { id: selection.$tag });
            way = _.find($scope.availalbePostWays, { id: selection.$way });

            $scope.selection = selection;
            $scope.selectionAnchor = selection && selection.getHighlightElements()[0];
            $scope.selectionData = { tag: tag, way: way };
        }

        $scope.initialize = function () {
            highlighter = postService.getHighlighter();
        };

        $scope.saveSelection = function () {
            if (!$scope.selectionData || !$scope.selectionData.way || !$scope.selectionData.tag) {
                return;
            }

            $scope.selection.$tag = $scope.selectionData.tag.id;
            $scope.selection.$way = $scope.selectionData.way.id;

            clear();
            cacheHighlights();
        };

        /**
         * removes the last selection object is it is set. selection object we
         * want to keep must be serialized and unset from this var
         */
        $scope.selectionStarting = function () {
            highlighter.removeHighlights([$scope.selection]);
            $window.getSelection().removeAllRanges();

            clear();

            // removing the selection may have removed a previsouly selected
            // highlight that we should restore
            restoreCachedHighlights();
        };

        $scope.selectionMade = function () {
            var selections = highlighter.highlightSelection('highlight'),
                selection = selections[selections.length - 1];

            if (selection && selection.getText() && selection.getText().trim()) {
                showSelection(selection);
                $window.getSelection().removeAllRanges();
            }
        };

        $scope.fetchArticle = function () {
            if (!$scope.url) {
                return;
            }

            $scope.loading = true;
            $scope.article = null;

            extract.fetch($scope.url).then(function (article) {
                if (!article.ok) {
                    $window.alert('Error loading article');
                }

                $scope.url = decodeURIComponent(article.source);
                $scope.article = article;
                $scope.loading = false;
                $scope.$apply();

                // $evalAsync makes it so the highlights appear right as the
                // article appears
                $scope.$evalAsync(restoreCachedHighlights);
            });
        };

        $scope.showAnnotations = function (ev) {
            showSelection(highlighter.getHighlightForElement(ev.target));
        };

        $scope.edit = function () {
            $scope.editing = true;
        };

        $scope.save = function () {
            $scope.editing = false;
        };

        // XXX - remove once done testing
        $scope.company = 'Hormel';
        $scope.url = 'http://www.nytimes.com/2015/05/28/world/asia/chinas-high-hopes-for-growing-those-rubber-tree-plants.html';
        $scope.fetchArticle();
        $scope.availalbePostTags = [
            {
                id: 1,
                label: 'Fishing'
            },
            {
                id: 2,
                label: 'Human rights'
            },
            {
                id: 3,
                label: 'Labor'
            },
        ];
    }
]);
