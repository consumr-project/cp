angular.module('tcp').directive('snav', function () {
    'use strict';

    var template = '<div class="snav"><ng-transclude></ng-transclude></div>';

    /**
     * @param {jQuery} elem
     * @param {jQuery} child
     */
    function select(elem, child) {
        elem
            .find('.snav__item')
            .removeClass('snav__item--active');

        child
            .closest('.snav__item')
            .addClass('snav__item--active');
    }

    /**
     * @param {number | string} value
     * @return {string}
     */
    function sel_value(value) {
        return '[value=' + value + ']';
    }

    /**
     * @param {angular.Scope} scope
     * @param {jQuery} elem
     * @param {angular.Attributes} attrs
     */
    function link(scope, elem, attrs) {
        scope.$watch('value', function (value) {
            setTimeout(function () {
                select(elem, elem.find(sel_value(value)));
            }, 10);
        });
    }

    return {
        replace: true,
        transclude: true,
        template: template,
        link: link,
        scope: {
            value: '=',
        },
    };
});
