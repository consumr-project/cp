/* global $ */
$(function () {
    'use strict';

    $(document).on('keydown', function (ev) {
        if (document.activeElement !== document.body) {
            return;
        }

        switch (ev.keyCode) {
            // forward-slash
            case 191:
                $('.search__input').focus();
                ev.preventDefault();
                break;
        }
    });
});
