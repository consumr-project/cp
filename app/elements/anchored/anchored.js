/**
 * @attribute anchoredShow {Boolean} show/hide toggle
 *
 * @attribute anchoredElement {Node|String} node or node selector to anchor
 * element to
 *
 * @attribute anchoredTopOffset {Number} pixels element should be above/below
 * anchor
 *
 * @attribute anchoredLeftOffset {Number} pixels element should be left/right
 * anchor
 *
 * @attribute anchoredPlacement {String} element location relative to anchor.
 * Options: @see PLACEMENT
 */
angular.module('tcp').directive('anchored', [
    '$document',
    '$window',
    'lodash',
    function ($document, $window, _) {
        'use strict';

        var PLACEMENT {
            BOTTOM: 'bottom',
            LEFT: 'left',
            RIGHT: 'right',
            TOP: 'top'
        };

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
                case PLACEMENT.TOP:
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
                case PLACEMENT.TOP:
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
                var debouncedHandleUpdate = _.debounce(handleUpdate.bind(null, true), 100);

                attrs.anchoredPlacement = attrs.anchoredPlacement || PLACEMENT.TOP;
                attrs.anchoredTopOffset = parseFloat(attrs.anchoredTopOffset) || 0;
                attrs.anchoredLeftOffset = parseFloat(attrs.anchoredLeftOffset) || 0;

                elem.css('position', 'absolute');
                elem.hide();

                function hide() {
                    elem.hide();
                }

                /**
                 * @param {Boolean} [now] (default: false) no animation
                 */
                function show(now) {
                    var coor = getCoordinates(
                        attrs.anchoredPlacement,
                        angular.element(scope.element),
                        elem,
                        attrs
                    );

                    if (now === true) {
                        elem.show().css({
                            opacity: 1,
                            top: coor.top,
                            left: coor.left,
                        });
                    } else {
                        elem.show().css({
                            top: coor.initialTop,
                            left: coor.initialLeft,
                            opacity: 0
                        });

                        elem.stop().animate({
                            opacity: 1,
                            top: coor.top,
                            left: coor.left,
                        });
                    }
                }

                /**
                 * @param {Boolean} [now] @see show
                 */
                function handleUpdate(now) {
                    if (!scope.show || !scope.element) {
                        hide();
                    } else {
                        show(now);
                    }
                }

                function unlistenToResizes() {
                    angular.element($window).off('resize', debouncedHandleUpdate);
                }

                validate(attrs);
                angular.element($window).on('resize', debouncedHandleUpdate);
                scope.$on('$destroy', unlistenToResizes);
                scope.$watch('show', handleUpdate);
                scope.$watch('element', handleUpdate);
            }
        };
    }
]);
