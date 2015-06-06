angular.module('tcp').controller('postController', [
    '$scope',
    '$window',
    '$timeout',
    'highlighter',
    'extract',
    'lodash',
    function ($scope, $window, $timeout, highlighter, extract, _) {
        'use strict';

        var pen, showcasing_tag_id;

        $scope.loading = false;
        $scope.editing = true;
        $scope.showcasing = false;

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
            showcasing_tag_id = null;
            $scope.showcasing = false;
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
            var tags = _.pluck(_.map(pen.highlights, getTag), 'tag');

            $scope.selectionTags = _.sortBy(_.uniq(tags, function (tag) {
                return tag.id;
            }), 'label');
        }

        /**
         * @return {Boolean}
         */
        function cacheHighlights() {
            localStorage.setItem(key(), highlighter.serialize(pen));
            return localStorage.hasOwnProperty(key());
        }

        /**
         * @param {Boolean} [skipSummary] (default: false)
         * @return {Boolean}
         */
        function restoreCachedHighlights(skipSummary) {
            var highlights = localStorage.getItem(key());

            if (highlights) {
                highlighter.deserialize(pen, highlights);
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
         * @return {Node[]}
         */
        function getHighlightElements(selection) {
            return selection.getHighlightElements();
        }

        /**
         * @param {Boolean|Node[]} if false, no showcase. if Node[], showcase
         * those elements
         */
        function showcase(elements) {
            angular.element('#postContent .showcased').removeClass('showcased');
            angular.element(elements).addClass('showcased');
            $scope.showcasing = !!elements;
        }

        /**
         * @param {rangy.Highlight} selection
         */
        function showSelection(selection) {
            if (!selection) {
                return;
            }

            $scope.selection = selection;
            $scope.selectionAnchor = selection.getHighlightElements()[0];
            $scope.selectionData = getTag(selection);

            showcase(selection.getHighlightElements());
        }

        $scope.initialize = function () {
            pen = highlighter.create();
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
            pen.removeHighlights([$scope.selection]);
            $window.getSelection().removeAllRanges();

            clear();

            // removing the selection may have removed a previsouly selected
            // highlight that we should restore
            restoreCachedHighlights(true);
        };

        $scope.selectionMade = function () {
            var selections = pen.highlightSelection('highlight', {containerElementId: 'postContent'}),
                selection = selections[selections.length - 1];

            if (selection && selection.getText() && selection.getText().trim()) {
                showSelection(selection);
                $window.getSelection().removeAllRanges();
            }
        };

        $scope.fetchPost = function () {
            if (!$scope.url) {
                return;
            }

            clear();
            $scope.loading = true;
            $scope.post = null;

            extract.fetch($scope.url).then(function (post) {
                if (!post.ok) {
                    $window.alert('Error loading post');
                }

                $scope.url = decodeURIComponent(post.source);
                $scope.post = post;
                $scope.loading = false;
                $scope.$apply();

                // $evalAsync makes it so the highlights appear right as the
                // post appears
                $scope.$evalAsync(restoreCachedHighlights);
            });
        };

        $scope.showAnnotations = function (ev) {
            showSelection(pen.getHighlightForElement(ev.target));
        };

        $scope.showcaseHighlightsByTag = function (tag_id) {
            if (tag_id === showcasing_tag_id) {
                clear();
                showcase(false);
            } else {
                showcasing_tag_id = tag_id;
                showcase(_.chain(pen.highlights)
                    .where({ $tag: tag_id })
                    .map(getHighlightElements)
                    .flatten()
                    .value());
            }
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
        $scope.fetchPost();
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
