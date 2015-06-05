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

        $scope.selection = null;
        $scope.selectionAnchor = null;
        $scope.selectionData = null;
        $scope.selectionTags = null;

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

        function summaryzeHighlights() {
            var tags = _.pluck(_.map(highlighter.highlights, getTag), 'tag');

            $scope.selectionTags = _.sortBy(_.uniq(tags, function (tag) {
                return tag.id;
            }), 'label');
        }

        /**
         * @return {Boolean}
         */
        function cacheHighlights() {
            localStorage.setItem(key(), postService.serializeHighlights(highlighter));
            return localStorage.hasOwnProperty(key());
        }

        /**
         * @param {Boolean} [skipSummary] (default: false)
         * @return {Boolean}
         */
        function restoreCachedHighlights(skipSummary) {
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

            if (skipSummary !== true) {
                summaryzeHighlights();
            }

            return !!highlights;
        }

        /**
         * @param {rangy.Highlight} selection
         * @return {Object}
         */
        function getTag(selection) {
            return {
                tag: _.find($scope.availalbePostTags, { id: selection.$tag }),
                way: _.find($scope.availalbePostWays, { id: selection.$way })
            };
        }

        /**
         * @param {rangy.Highlight} selection
         */
        function showSelection(selection) {
            if (!selection) {
                return;
            }

            $scope.selection = selection;
            $scope.selectionAnchor = selection && selection.getHighlightElements()[0];
            $scope.selectionData = getTag(selection);
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
            summaryzeHighlights();
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
            restoreCachedHighlights(true);
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
