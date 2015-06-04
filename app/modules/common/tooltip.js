angular.module('tcp').directive('tcpTooltip', [
    'lodash',
    '$window',
    function (_, $window) {
        'use strict';

        var win = angular.element($window);

        return {
            scope: {
                'anchor': '=tcpTooltip'
            },
            link: function (scope, elem, attrs) {
                var pos, stop, displayTooltipDebounced, displayTooltipReposition, $anchor;

                function displayTooltip(immediate) {
                    var loc = {};

                    $anchor = angular.element(scope.anchor);
                    pos = $anchor.offset();

                    pos.left += $anchor.outerWidth() / 2;
                    pos.left -= elem.outerWidth() / 2;

                    // XXX wft?
                    pos.left -= parseInt(angular.element('.main').css('margin-left'));

                    pos.top -= elem.height();
                    pos.top -= 30;

                    loc = {
                        display: 'block',
                        top: pos.top,
                        left: pos.left,
                        opacity: 1
                    };

                    if (!immediate) {
                        elem.css({
                            display: 'block',
                            top: pos.top - 10,
                            left: pos.left,
                            opacity: 0
                        });
                    }

                    return immediate ? elem.css(loc) : elem.animate(loc, 300);
                }

                function hideTooltip() {
                    return elem.animate({
                        opacity: 0
                    }, 100, function () {
                        elem.css({ display: 'none' });
                    });
                }

                displayTooltipDebounced = _.debounce(displayTooltip, 250);
                displayTooltipReposition = _.debounce(displayTooltip.bind(null, true), 50);

                stop = scope.$watch('anchor', function () {
                    if (scope.anchor) {
                        displayTooltipDebounced();
                        win.on('resize', displayTooltipReposition);
                    } else {
                        hideTooltip();
                        win.off('resize', displayTooltipReposition);
                    }
                });

                elem.css({ opacity: 0 });
                scope.$on('$destroy', stop);
            }
        };
    }
]);
