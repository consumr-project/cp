angular.module('tcp').directive('highlighter', [
    '$document',
    'highlighter',
    function ($document, highlighter) {
        'use strict';

        var DEFAULT_HIGHLIGHT_CLASS_NAME = 'article--highlight';

        return {
            scope: {
                highlighterOnClick: '&',
                highlighterOnHighlight: '&',
                highlighterOnHighlightClick: '&',
            },
            link: function (scope, elem, attr) {
                var name = attr.highlighterClassName || DEFAULT_HIGHLIGHT_CLASS_NAME,
                    pen = highlighter.create(name),
                    id = elem.attr('id');

                if (!id) {
                    console.warn('Missing `id` on', elem);
                }

                function handleElementClick(ev) {
                    scope.highlighterOnClick({
                        $event: ev,
                        target: ev.target
                    });

                    if (angular.element(ev.target).hasClass(name)) {
                        scope.highlighterOnHighlightClick({
                            $event: ev,
                            highlight: pen.getHighlightForElement(ev.target),
                            target: ev.target
                        });
                    }
                }

                function handleDocumentMouseUp(ev) {
                    var highlights = pen.highlight({
                        containerElementId: id
                    });

                    if (highlights.length) {
                        scope.highlighterOnHighlight({
                            $event: ev,
                            highlight: highlights[0],
                            highlights: highlights,
                            pen: pen,
                            target: ev.target
                        });
                    }
                }

                elem.on('click', handleElementClick);
                $document.on('mouseup', handleDocumentMouseUp);

                scope.$on('$destroy', function () {
                    $document.off('mouseup', handleDocumentMouseUp);
                });
            }
        };
    }
]);
