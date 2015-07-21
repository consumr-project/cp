angular.module('tcp').directive('markupViewer', function () {
    'use strict';

    /**
     * @param {String} str
     * @return {String}
     */
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * @param {String} line
     * return {Number}
     */
    function getLeadingWhiteSpaceLen(line) {
        var match = line.match(/^\s+/);
        return !match ? 0 : match[0].length;
    }

    /**
     * @param {String} text
     * @return {String}
     */
    function removeLeadingWhitespace(text) {
        var lines = text.split('\n'),
            count = 0,
            matcher;

        var i = 0,
            len = lines.length;

        for (i = 0; i < len; i++) {
            if (!lines[i]) {
                continue;
            }

            count = getLeadingWhiteSpaceLen(lines[i]);
            break;
        }

        if (!count) {
            return text;
        }

        matcher = new RegExp('\\s{' + count + '}');

        for (i = 0; i < len; i++) {
            if (!lines[i]) {
                continue;
            }

            lines[i] = lines[i].replace(matcher, '');
        }

        return trim(lines.join('\n'));
    }

    return {
        restrict: 'A',
        compile: function (elem, attrs) {
            var snippet = document.createElement('pre'),
                node = elem[0];

            snippet.innerText = removeLeadingWhitespace(node.innerHTML);
            snippet.title = 'Code Sample';
            snippet.className = 'markdown-viewer-output';

            node.appendChild(snippet);
        }
    };
});
