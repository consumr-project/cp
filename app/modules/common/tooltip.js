'use strict';

angular.module('tcp').directive('tcpTooltip', ['lodash', function (_) {
    return {
        scope: {
            'anchor': '=tcpTooltip'
        },
        link: function (scope, elem, attrs) {
            var pos, stop, displayTooltipDebounced, $anchor;

            function displayTooltip() {
                $anchor = $(scope.anchor);
                pos = $anchor.offset()

                pos.left += $anchor.outerWidth() / 2;
                pos.left -= elem.outerWidth() / 2;

                // XXX wft?
                pos.left -= parseInt($('.main').css('margin-left'));

                pos.top -= elem.height();
                pos.top -= 30;

                elem.css({
                    display: 'block',
                    top: pos.top - 10,
                    left: pos.left,
                    opacity: 0
                });

                return elem.animate({
                    opacity: 1,
                    top: pos.top
                }, 300);
            }

            function hideTooltip() {
                return elem.animate({
                    opacity: 0
                }, 100, function () {
                    elem.css({ display: 'none' });
                });
            }

            displayTooltipDebounced = _.debounce(displayTooltip, 250);
            stop = scope.$watch('anchor', function () {
                return !scope.anchor ? hideTooltip() : displayTooltipDebounced();
            });

            scope.$on('$destroy', stop);
        }
    };
}]);
