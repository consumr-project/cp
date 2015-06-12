angular.module('tcp').controller('postController', [
    '$scope',
    '$routeParams',
    '$window',
    '$timeout',
    'highlighter',
    'extract',
    'lodash',
    'companyStore',
    'postStore',
    function ($scope, $routeParams, $window, $timeout, highlighter, extract, _, companyStore, postStore) {
        'use strict';

        var pen, showcasing_tag_id;

        $scope.company = {};
        $scope.post = {};
        $scope.selection = {};

        $scope.loading = false;
        $scope.editing = false;
        $scope.showcasing = false;

        // XXX - get real tag ways
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

        // XXX - get real tags
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

        function clear() {
            showcasing_tag_id = null;
            $scope.showcasing = false;

            $scope.selection.highlight = null;
            $scope.selection.anchor = null;

            $timeout(function () {
                $scope.selection.data = null;
            });
        }

        /**
         * generate a highlights storage key
         * @return {String}
         */
        function key() {
            return 'hi-' + $scope.post.url;
        }

        function summaryzeHighlights() {
            var tags = _.pluck(_.map(pen.highlights, getTag), 'tag');

            $scope.selection.tags = _.sortBy(_.uniq(tags, function (tag) {
                return tag.id;
            }), 'label');
        }

        /**
         * @return {Boolean}
         */
        function uncacheHighlights() {
            localStorage.removeItem(key());
            return !localStorage.hasOwnProperty(key());
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

            $scope.selection.highlight = selection;
            $scope.selection.anchor = selection.getHighlightElements()[0];
            $scope.selection.data = getTag(selection);

            showcase(selection.getHighlightElements());
        }

        $scope.initialize = function () {
            pen = highlighter.create();

            $scope.loading = true;
            $scope.editing = !$routeParams.guid;

            entity.get(companyStore, $routeParams.companyGuid).then(function (company) {
                $scope.company = company;

                // no post guid, adding a new post
                if (!$routeParams.guid) {
                    $scope.editing = true;
                    $scope.loading = false;
                    $scope.$apply()
                    return;
                }

                // post guid, editing a post
                entity.get(postStore, $routeParams.guid).then(function (post) {
                    $scope.post = post;
                    $scope.loading = false;
                    $scope.$apply();
                    $scope.$evalAsync(restoreCachedHighlights);
                });
            });
        };

        $scope.saveSelection = function () {
            if (!$scope.selection.data || !$scope.selection.data.way || !$scope.selection.data.tag) {
                return;
            }

            $scope.selection.highlight.$tag = $scope.selection.data.tag.id;
            $scope.selection.highlight.$way = $scope.selection.data.way.id;

            clear();
            cacheHighlights();
            summaryzeHighlights();
        };

        /**
         * removes the last selection object is it is set. selection object we
         * want to keep must be serialized and unset from this var
         */
        $scope.selectionStarting = function () {
            pen.removeHighlights([$scope.selection.highlight]);
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
            if (!$scope.post.url) {
                return;
            }

            clear();
            $scope.loading = true;

            $scope.post.title = null;
            $scope.post.content = null;

            extract.fetch($scope.post.url).then(function (post) {
                if (!post.ok) {
                    $window.alert('Error loading post');
                }

                $scope.post.url = decodeURIComponent(post.source);
                $scope.post.title = post.title;
                $scope.post.content = post.content;

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
                clear();
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
            clear();
            uncacheHighlights();

            $scope.loading = true;
            $scope.post.companyId = $scope.company.__id;

            entity.upsert(postStore, $scope.post).then(function () {
                utils.state('company', $scope.company.guid, 'post', $scope.post.guid);
                $scope.loading = false;
                $scope.editing = false;
                $scope.$apply();
            });
        };
    }
]);
