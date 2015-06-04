angular.module('tcp').service('postService', ['lodash', function (_) {
    /**
     * @param {rangy.Highlighter} highlighter
     * @return {Object[]}
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
     * @return {Object[]}
     */
    function deserializeHighlights(highlighter, highlights) {
        return [getHighlighter().serialize()].concat(_.map(JSON.parse(highlights), function (hi) {
            return [
                hi.start,
                hi.end,
                hi.id,
                hi.type,
                hi.container
            ].join('$');
        })).join('|');
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

    return window.postService = {
        getHighlighter: getHighlighter,
        deserializeHighlights: deserializeHighlights,
        serializeHighlights: serializeHighlights,
    };
}]);
