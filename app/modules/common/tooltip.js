'use strict';

angular.module('tcp').directive('tcpTooltip', function () {
    /**
     * @param {Node} elem
     * @return {Object}
     */
    function getPosition(elem) {
        var top = 0, left = 0;

        while (elem) {
            top += elem.offsetTop || 0;
            left += elem.offsetLeft || 0;
            elem = elem.offsetParent;
        }

        return {
            top: top,
            left: left
        };
    }

    return {
        scope: {
            'anchor': '=tcpTooltip'
        },
        link: function (scope, elem, attrs) {
            var pos, stop;

            stop = scope.$watch('anchor', function () {
                if (!scope.anchor) {
                    elem.css({ display: 'none' });
                    return;
                }

                pos = getPosition(scope.anchor);
                // window.anchor=scope.anchor
                elem.css({
                    display: 'block',
                    top: pos.top + 'px',
                    left: pos.left + 'px'
                });
            });

            scope.$on('$destroy', stop);
        }
    };
});
