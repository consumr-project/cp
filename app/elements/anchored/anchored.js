angular.module('tcp').directive('anchored', [
    '$document',
    '$window',
    'lodash',
    function ($document, $window, _) {
        'use strict';

        var PLACEMENT_TOP = 'top';

        var ANIMATION_NUDGE_OFFSET = 10;

        var STATE_ON = {},
            STATE_OFF = {};

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
                var debouncedHandleUpdate = _.debounce(handleUpdate, 100),
                    state;

                attrs.anchoredPlacement = attrs.anchoredPlacement || PLACEMENT_TOP;
                attrs.anchoredTopOffset = parseFloat(attrs.anchoredTopOffset) || 0;
                attrs.anchoredLeftOffset = parseFloat(attrs.anchoredLeftOffset) || 0;

                elem.css('position', 'absolute');
                elem.hide();

                function hide() {
                    state = STATE_OFF;

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

                    if (state === STATE_ON) {
                        elem.css({
                            opacity: 1,
                            top: coor.top,
                            left: coor.left,
                        });
                    } else {
                        state = STATE_ON;

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
                }

                function handleUpdate() {
                    if (!scope.show || !scope.element) {
                        hide();
                    } else {
                        show();
                    }
                }

                function unlistenToResizes() {
                    animate.element($window).off('resize', debouncedHandleUpdate);
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
