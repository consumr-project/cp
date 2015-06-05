angular.module('tcp').service('postService', [
    'lodash',
    'rangy',
    function (_, rangy) {
        'use strict';

        /**
         * @param {rangy.Highlighter} highlighter
         * @return {String}
         */
        function serializeHighlights(highlighter) {
            return JSON.stringify([highlighter.serialize(), _.map(highlighter.highlights, function (hi) {
                return {
                    id: hi.id,
                    tag: hi.$tag,
                    way: hi.$way
                };
            })]);
        }

        /**
         * @param {rangy.Highlighter} highlighter
         * @param {String} highlights
         */
        function deserializeHighlights(highlighter, highlights) {
            var parts = JSON.parse(highlights);
            highlighter.deserialize(parts[0]);
            _.each(highlighter.highlights, function (hi) {
                var tag = _.find(parts[1], {id: hi.id});

                if (tag) {
                    hi.$tag = tag.tag;
                    hi.$way = tag.way;
                }
            });
        }

        /**
         * @return {rangy.Highlighter}
         */
        function getHighlighter() {
            var highlighter;

            rangy.init();
            highlighter = rangy.createHighlighter();
            highlighter.addClassApplier(rangy.createClassApplier('highlight', {
                ignoreWhiteSpace: true,
                tagNames: ['span']
            }));

            return highlighter;
        }

        return {
            getHighlighter: getHighlighter,
            deserializeHighlights: deserializeHighlights,
            serializeHighlights: serializeHighlights,
        };
    }
]);
