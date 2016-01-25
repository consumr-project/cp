angular.module('tcp').directive('collapsable', function () {
    'use strict';

    var CLASS_BASE = 'collapsable',
        CLASS_TRIGGER = 'collapsable__trigger',
        CLASS_OFF = 'collapsable--off',
        CLASS_ON = 'collapsable--on';

    var FIELD_STATE = 'collapsable:state',
        FIELD_AREA_ATTR = '[collapsable-area]',
        FIELD_TRIGGER_ATTR = '[collapsable-trigger]';

    var STATE_OFF = 0,
        STATE_ON = 1;

    /**
     * @param {jQuery} elem
     * @return {jQuery}
     */
    function on(elem) {
        return elem
            .data(FIELD_STATE, STATE_ON)
            .removeClass(CLASS_OFF)
            .addClass(CLASS_ON)
            .find(FIELD_AREA_ATTR)
            .slideDown()
            .end();
    }

    /**
     * @param {jQuery} elem
     * @return {jQuery}
     */
    function off(elem) {
        return elem
            .data(FIELD_STATE, STATE_OFF)
            .removeClass(CLASS_ON)
            .addClass(CLASS_OFF)
            .find(FIELD_AREA_ATTR)
            .slideUp()
            .end();
    }

    /**
     * @param {jQuery} elem
     * @return {Function}
     */
    function trigger(elem) {
        return function () {
            switch (elem.data(FIELD_STATE)) {
                case STATE_ON:
                    off(elem);
                    break;

                case STATE_OFF:
                    on(elem);
                    break;
            }
        };
    }

    /**
     * @param {angular.Scope} scope
     * @param {jQuery} elem
     * @param {angular.Attributes} attrs
     * @return {void}
     */
    function link(scope, elem, attrs) {
        on(elem).addClass(CLASS_BASE)
            .find(FIELD_TRIGGER_ATTR)
            .addClass(CLASS_TRIGGER)
            .click(trigger(elem));
    }

    return {
        restrict: 'A',
        priority: 1001,
        link: link
    };
});
