/**
 * @attribute {Boolean} anchoredShow show/hide toggle
 *
 * @attribute {Node|String} anchoredElement node or node selector to anchor
 * element to
 *
 * @attribute {Number} [anchoredTopOffset] pixels element should be above/below
 * anchor
 *
 * @attribute {Number} [anchoredRightOffset] pixels element should be right
 * anchor
 *
 * @attribute {Number} [anchoredLeftOffset] pixels element should be right
 * anchor
 *
 * @attribute {Number} [anchoredAnimationOffset] slide in animation offset.
 * (default: ANIMATION_NUDGE_OFFSET)
 *
 * @attribute {String} [anchoredPlacement] element location relative to anchor.
 * Options: @see PLACEMENT (default: PLACEMENT.TOP)
 *
 * @attribute {Boolean} [anchoredAutoHide] hide the anchored element if user
 * clicked outside of the trigger or itself (default: false)
 *
 * @attribute {Boolean} [anchoredCentered] center the anchored element
 * horizontally if placement eq bottom or top. ignored if placement is left
 * or right (default: false)
 *
 * @attribute {Boolean} [anchoredArrow] render an arrow pointing to the anchor
 */
angular.module('tcp').directive('anchored', [
    '$document',
    '$window',
    'lodash',
    function ($document, $window, _) {
        'use strict';

        var PLACEMENT = {
            BOTTOM: 'bottom',
            BOTTOM_RIGHT: 'bottom-right',
            LEFT: 'left',
            RIGHT: 'right',
            RIGHT_BOTTOM: 'right-bottom',
            TOP: 'top'
        };

        var ANIMATION_NUDGE_OFFSET = 10,
            ANIMATION_IN_TIME = 50,
            ANIMATION_OUT_TIME = 100;

        /**
         * @param {Boolean} test
         * @param {String} message
         * @throws {Error}
         */
        function assert(test, message) {
            if (!test) {
                throw new Error(message);
            }
        }

        /**
         * @param {Object} attrs
         * @throws {Error}
         */
        function validate(attrs) {
            assert(!isNaN(attrs.anchoredTopOffset),
                'Invalid top offset: ' + attrs.anchoredTopOffset);

            assert(!isNaN(attrs.anchoredLeftOffset),
                'Invalid top offset: ' + attrs.anchoredLeftOffset);

            assert(_.includes([
                PLACEMENT.BOTTOM,
                PLACEMENT.BOTTOM_RIGHT,
                PLACEMENT.RIGHT_BOTTOM,
                PLACEMENT.LEFT,
                PLACEMENT.RIGHT,
                PLACEMENT.TOP
            ], attrs.anchoredPlacement), 'Invalid placement: ' + attrs.anchoredPlacement);
        }

        /**
         * @param {Object} holder
         * @param {String} prop
         * @param {Number} addition
         */
        function sumIfPresent(holder, prop, addition) {
            if (prop in holder) {
                holder[prop] += addition;
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
                height = anchorElement.outerHeight(),
                width = anchorElement.outerWidth();

            var offset = anchorTo.position(),
                offset_height = anchorTo.outerHeight(),
                offset_width = anchorTo.outerWidth();

            switch (placement) {
                case PLACEMENT.TOP:
                    coors.top = offset.top - height;
                    coors.left = !attrs.anchoredCentered ? offset.left :
                        total_width / 2 - width / 2;

                    coors.initialLeft = coors.left;
                    coors.initialTop = coors.top - attrs.anchoredAnimationOffset;
                    break;

                case PLACEMENT.BOTTOM:
                    coors.top = offset.top + offset_height;
                    coors.left = !attrs.anchoredCentered ? offset.left :
                        total_width / 2 - width / 2;

                    coors.initialLeft = coors.left;
                    coors.initialTop = coors.top + attrs.anchoredAnimationOffset;
                    break;

                case PLACEMENT.BOTTOM_RIGHT:
                    coors.top = offset.top + offset_height;
                    coors.left = offset.left - width + offset_width;

                    coors.initialLeft = coors.left;
                    coors.initialTop = coors.top + attrs.anchoredAnimationOffset;
                    break;

                case PLACEMENT.RIGHT_BOTTOM:
                    coors.bottom = offset.top;
                    coors.left = offset.left + offset_width;
                    coors.initialLeft = coors.left + attrs.anchoredAnimationOffset;
                    coors.initialBottom = coors.top;
                    break;

                case PLACEMENT.RIGHT:
                    coors.top = offset.top;
                    coors.left = offset.left + offset_width;
                    coors.initialLeft = coors.left + attrs.anchoredAnimationOffset;
                    coors.initialTop = coors.top;
                    break;

                case PLACEMENT.LEFT:
                    coors.top = offset.top;
                    coors.left = offset.left - width;
                    coors.initialLeft = coors.left - attrs.anchoredAnimationOffset;
                    coors.initialTop = coors.top;
                    break;
            }

            sumIfPresent(coors, 'top', attrs.anchoredTopOffset);
            sumIfPresent(coors, 'initialTop', attrs.anchoredTopOffset);
            sumIfPresent(coors, 'left', attrs.anchoredLeftOffset);
            sumIfPresent(coors, 'initialLeft', attrs.anchoredLeftOffset);
            sumIfPresent(coors, 'right', attrs.anchoredRightOffset);
            sumIfPresent(coors, 'initialRight', attrs.anchoredRightOffset);

            return coors;
        }

        return {
            scope: {
                show: '=anchoredShow',
                element: '=anchoredElement'
            },
            link: function (scope, elem, attrs) {
                var debouncedHandleUpdate = _.debounce(_.throttle(handleUpdate.bind(null, true), 100), 10);

                attrs.anchoredPlacement = attrs.anchoredPlacement || PLACEMENT.TOP;
                attrs.anchoredTopOffset = parseFloat(attrs.anchoredTopOffset) || 0;
                attrs.anchoredLeftOffset = parseFloat(attrs.anchoredLeftOffset) || 0;
                attrs.anchoredAnimationOffset = parseFloat(attrs.anchoredAnimationOffset) || ANIMATION_NUDGE_OFFSET;
                attrs.anchoredCentered = 'anchoredCentered' in attrs;
                attrs.anchoredAutoHide = 'anchoredAutoHide' in attrs;

                elem.css('position', 'absolute');
                elem.hide();

                function hide() {
                    elem.animate({ opacity: 0 }, ANIMATION_OUT_TIME, function () {
                        elem.hide();
                    });
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
                            bottom: coor.bottom,
                            left: coor.left,
                            right: coor.right,
                            top: coor.top,
                        });
                    } else {
                        elem.show().css({
                            opacity: 0,
                            bottom: coor.initialBottom,
                            left: coor.initialLeft,
                            right: coor.initialRight,
                            top: coor.initialTop,
                        });

                        elem.stop().animate({
                            opacity: 1,
                            bottom: coor.bottom,
                            left: coor.left,
                            right: coor.right,
                            top: coor.top,
                        }, ANIMATION_IN_TIME);
                    }
                }

                /**
                 * @param {Boolean} [now]
                 * @see show()
                 */
                function handleUpdate(now) {
                    if (!scope.show || !scope.element) {
                        hide();
                    } else {
                        show(now);
                    }
                }

                /**
                 * hides the anchored element if user clicked outside
                 * @param {Event} ev
                 * @see hide()
                 */
                function handleClick(ev) {
                    var target = angular.element(ev.target),
                        element = angular.element(scope.element);

                    if (
                        // is not the trigger element
                        !target.is(element) &&
                        // and is not a child of the trigger element
                        !element.has(target).length &&
                        // and is not the anchored element
                        !elem.is(target).length &&
                        // and is not a child of the anchored element
                        !elem.has(target).length
                    ) {
                        hide();
                        scope.show = false;
                        scope.$apply();
                    }
                }

                function unlistenToResizes() {
                    angular.element($window).off('resize', debouncedHandleUpdate);
                }

                function unlistenToClicks() {
                    angular.element($document).off('click', handleClick);
                }

                validate(attrs);

                scope.$watch('show', handleUpdate.bind(null, false));
                scope.$watch('element', handleUpdate.bind(null, false));

                angular.element($window).on('resize', debouncedHandleUpdate);
                scope.$on('$destroy', unlistenToResizes);

                if (attrs.anchoredArrow) {
                    angular.element('<div></div>')
                        .addClass('anchored__arrow--outline')
                        .addClass('anchored__arrow--outline--' + attrs.anchoredPlacement)
                        .appendTo(elem);

                    angular.element('<div></div>')
                        .addClass('anchored__arrow')
                        .addClass('anchored__arrow--' + attrs.anchoredPlacement)
                        .appendTo(elem);
                }

                if (attrs.anchoredAutoHide) {
                    angular.element($document).on('click', handleClick);
                    scope.$on('$destroy', unlistenToClicks);
                }
            }
        };
    }
]);
