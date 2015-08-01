angular.module('tcp').directive('highlighter', [
    '$window',
    '$document',
    'highlighter',
    function ($window, $document, highlighter) {
        'use strict';

        var DEFAULT_HIGHLIGHT_CLASS_NAME = 'article--highlight';

        var NODE_IGNORE_MOUSE_EVENTS = ['INPUT', 'BUTTON'];

        return {
            scope: {
                highlighterApi: '=',
                highlighterOnHighlight: '&',
                highlighterOnHighlightClick: '&',
                highlighterOnNonHighlightClick: '&',
                highlighterClassName: '@'
            },
            link: function (scope, elem) {
                var class_name = scope.highlighterClassName || DEFAULT_HIGHLIGHT_CLASS_NAME,
                    pen = highlighter.create(class_name),
                    id = elem.attr('id');

                if (!id) {
                    console.warn('Missing `id` on', elem);
                }

                if (scope.highlighterApi) {
                    scope.highlighterApi.remove = function (highlight) {
                        return pen.removeHighlights([highlight]);
                    };
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
                        highlight: highlight !== undefined ? highlight : pen.getHighlightForElement(ev.target),
                        pen: pen,
                        target: ev.target
                    };
                }

                function handleElementClick(ev) {
                    if (angular.element(ev.target).hasClass(class_name)) {
                        scope.highlighterOnHighlightClick(eventPackage(ev));
                    } else {
                        scope.highlighterOnNonHighlightClick(eventPackage(ev, null));
                    }
                }

                function handleDocumentMouseUp(ev) {
                    var highlights, highlight;

                    // user is doing something unrelated to highlighting
                    if (NODE_IGNORE_MOUSE_EVENTS.indexOf(ev.target.nodeName) !== -1) {
                        return;
                    }

                    // this element is already highlighted
                    if (pen.getHighlightForElement(ev.target)) {
                        return;
                    }

                    highlights = pen.highlight({ containerElementId: id });
                    highlight = highlights && highlights.pop();

                    if (highlight && highlight.getText()) {
                        $window.getSelection().removeAllRanges();
                        scope.highlighterOnHighlight(eventPackage(ev, highlight));
                    }
                }

                function unhandleDocumentMouseUp() {
                    $document.off('mouseup', handleDocumentMouseUp);
                }

                elem.on('mousedown', handleElementClick);
                $document.on('mouseup', handleDocumentMouseUp);
                scope.$on('$destroy', unhandleDocumentMouseUp);
            }
        };
    }
]);
