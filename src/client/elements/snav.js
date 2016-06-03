angular.module('tcp').directive('snav', function () {
    'use strict';

    var template = '<div class="snav"><ng-transclude></ng-transclude></div>';

    /**
     * @param {angular.Scope} scope
     * @param {jQuery} elem
     * @param {angular.Attributes} attrs
     */
    function link(scope, elem, attrs) {
        elem.on('click', function (ev) {
            elem
                .find('.snav__item')
                .removeClass('snav__item--active');

            angular.element(ev.target)
                .closest('.snav__item')
                .addClass('snav__item--active');
        });
    }

    return {
        replace: true,
        transclude: true,
        template: template,
        link: link,
    };
});
