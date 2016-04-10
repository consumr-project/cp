/* global $, _ */
$(function () {
    'use strict';

    var CLASSES = [
        generate_offset_class(0),
        generate_offset_class(100),
    ];

    /**
     * @param {Number} num
     * @return {String}
     */
    function generate_offset_class(num) {
        return '--scroll-offset-' + num;
    }

    /**
     * sets and unset offset classes
     */
    function set_offset_class() {
        var top = document.body.scrollTop,
            add = [];

        if (!top || top < 100) {
            add.push(generate_offset_class(0));
        } else if (top >= 100) {
            add.push(generate_offset_class(100));
        }

        $(document.body)
            .addClass(add.join(' '))
            .removeClass(_.difference(CLASSES, add).join(' '));
    }

    $(window).scroll(_.debounce(set_offset_class, 100));
    set_offset_class();
});
