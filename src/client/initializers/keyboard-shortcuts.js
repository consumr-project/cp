/* global $ */
$(function () {
    $(document).on('keydown', function (ev) {
        if (document.activeElement !== document.body) {
            return;
        }

        switch (ev.keyCode) {
            // forward-slash
            case 191:
                $('input[i18n="admin/search_placeholder"]').focus();
                ev.preventDefault();
                break;
        }
    });
});
