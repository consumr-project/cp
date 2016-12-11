angular.module('tcp').directive('options', function () {
    'use strict';

    var CLASS_OPTION_ITEM = '.options__item';

    /**
     * @param {String} attr
     * @param {String} val
     * @return {String}
     */
    function by_attr(attr, val) {
        return ['[', attr, '=', val, ']'].join('');
    }

    /**
     * @param {Angular.Scope} $scope
     * @param {jQuery} $elem
     * @param {String} value
     */
    function set_value($scope, $elem, value) {
        $scope.onChange({ value: value });

        $elem.find(CLASS_OPTION_ITEM)
            .attr('selected', false);

        if (value) {
            $elem.find(CLASS_OPTION_ITEM + by_attr('value', value))
                .attr('selected', true);
        }
    }

    return {
        template: '<span class="options"><ng-transclude></ng-transclude></span>',
        transclude: true,
        replace: true,
        scope: {
            onChange: '&',
        },
        link: function (scope, elem) {
            elem.click(function (ev) {
                var target = angular.element(ev.target)
                    .closest(CLASS_OPTION_ITEM);

                if (target && target.length) {
                    set_value(scope, elem, target.attr('value'));
                }
            });
        },
    };
});
