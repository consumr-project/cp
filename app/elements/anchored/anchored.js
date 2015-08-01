angular.module('tcp').directive('anchored', [
    '$document',
    function ($document) {
        'use strict';

        var PLACEMENT_TOP = 'top';

        var ANIMATION_NUDGE_OFFSET = 10;

        /**
         * @param {Object} attrs
         * @throws {Error}
         */
        function validate(attrs) {
            if (isNaN(attrs.anchoredTopOffset)) {
                throw new Error('Invalid top offset: ' + attrs.anchoredTopOffset);
            }

            if (isNaN(attrs.anchoredLeftOffset)) {
                throw new Error('Invalid top offset: ' + attrs.anchoredLeftOffset);
            }

            switch (attrs.anchoredPlacement) {
                case PLACEMENT_TOP:
                    break;

                default:
                    throw new Error('Invalid placement: ' + attrs.anchoredPlacement);
            }
        }

        /**
         * @param {PLACEMENT_*} placement
         * @param {jQuery.element} anchorTo
         * @param {jQuery.element} anchorElement
         * @param {Object} attrs
         */
        function getCoordinates(placement, anchorTo, anchorElement, attrs) {
            var coors = {},
                total_width = $document.width(),
                offset = anchorTo.offset(),
                height = anchorElement.outerHeight(),
                width = anchorElement.outerWidth();

            switch (placement) {
                case PLACEMENT_TOP:
                    coors.top = offset.top - height;
                    coors.left = total_width / 2 - width / 2;

                    coors.top += attrs.anchoredTopOffset;
                    coors.left += attrs.anchoredLeftOffset;

                    coors.initialLeft = coors.left;
                    coors.initialTop = coors.top - ANIMATION_NUDGE_OFFSET;
                    break;
            }

            return coors;
        }

        return {
            scope: {
                show: '=anchoredShow',
                element: '=anchoredElement'
            },
            link: function (scope, elem, attrs) {
                attrs.anchoredPlacement = attrs.anchoredPlacement || PLACEMENT_TOP;
                attrs.anchoredTopOffset = parseFloat(attrs.anchoredTopOffset) || 0;
                attrs.anchoredLeftOffset = parseFloat(attrs.anchoredLeftOffset) || 0;

                elem.css('position', 'absolute');
                elem.hide();

                function hide() {
                    if (elem.is(':visible')) {
                        elem.animate({
                            opacity: 0
                        }, elem.hide.bind(elem));
                    } else {
                        elem.hide();
                    }
                }

                function show() {
                    var coor = getCoordinates(
                        attrs.anchoredPlacement,
                        angular.element(scope.element),
                        elem,
                        attrs
                    );

                    elem.show().css({
                        top: coor.initialTop,
                        left: coor.initialLeft,
                        opacity: 0
                    });

                    elem.animate({
                        opacity: 1,
                        top: coor.top,
                        left: coor.left,
                    });
                }

                function handleUpdate() {
                    if (!scope.show || !scope.element) {
                        hide();
                    } else {
                        show();
                    }
                }

                validate(attrs);
                scope.$watch('show', handleUpdate);
                scope.$watch('element', handleUpdate);
            }
        };
    }
]);
