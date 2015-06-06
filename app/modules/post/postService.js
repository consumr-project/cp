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
            return JSON.stringify(_.map(highlighter.highlights, function (hi) {
                return {
                    id: hi.id,
                    start: hi.characterRange.start,
                    end: hi.characterRange.end,
                    type: hi.classApplier.className,
                    container: hi.containerElementId,
                    tag: hi.$tag,
                    way: hi.$way,
                };
            }));
        }

        /**
         * @param {rangy.Highlighter} highlighter
         * @param {String} highlights
         */
        function deserializeHighlights(highlighter, highlights) {
            function serializeSingleHighlight(hi) {
                return [
                    hi.start,
                    hi.end,
                    hi.id,
                    hi.type,
                    hi.container
                ].join('$');
            }

            var p_highlights = JSON.parse(highlights),
                d_highlights = [getHighlighter().serialize()]
                    .concat(_.map(p_highlights, serializeSingleHighlight))
                    .join('|');

            highlighter.deserialize(d_highlights);

            // populate highlights with tag and way info
            _.each(p_highlights, function (hi) {
                var highlight = _.find(highlighter.highlights, {id: hi.id});

                if (highlight) {
                    highlight.$tag = hi.tag;
                    highlight.$way = hi.way;
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
