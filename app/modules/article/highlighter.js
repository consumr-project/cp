angular.module('tcp').directive('highlighter', [
    '$document',
    'highlighter',
    function ($document, highlighter) {
        'use strict';

        var DEFAULT_HIGHLIGHT_CLASS_NAME = 'article--highlight';

        return {
            scope: {
                highlighterOnHighlight: '&',
                highlighterOnHighlightClick: '&',
                highlighterClassName: '@'
            },
            link: function (scope, elem) {
                var class_name = scope.highlighterClassName || DEFAULT_HIGHLIGHT_CLASS_NAME,
                    pen = highlighter.create(class_name),
                    id = elem.attr('id');

                if (!id) {
                    console.warn('Missing `id` on', elem);
                }

                /**
                 * passed to highlighter event handlers
                 * @param {Event} ev
                 * @param {Highlight} [highlight]
                 * @return {Object}
                 */
                function eventPackage(ev, highlight) {
                    return {
                        $event: ev,
                        highlight: highlight || pen.getHighlightForElement(ev.target),
                        pen: pen,
                        target: ev.target
                    };
                }

                function handleElementClick(ev) {
                    if (angular.element(ev.target).hasClass(class_name)) {
                        scope.highlighterOnHighlightClick(eventPackage(ev));
                    }
                }

                function handleDocumentMouseUp(ev) {
                    var highlights = pen.highlight({
                        containerElementId: id
                    });

                    if (highlights.length) {
                        scope.highlighterOnHighlight(eventPackage(ev, highlights[0]));
                    }
                }

                function unhandleDocumentMouseUp() {
                    $document.off('mouseup', handleDocumentMouseUp);
                }

                elem.on('click', handleElementClick);
                $document.on('mouseup', handleDocumentMouseUp);
                scope.$on('$destroy', unhandleDocumentMouseUp);
            }
        };
    }
]);
