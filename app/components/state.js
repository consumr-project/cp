angular.module('tcp').directive('tcpState', [
    'SessionService',
    function (SessionService) {
        'use strict';

        function manage_login_class($elem, existance) {
            return function () {
                $elem.toggleClass('--is-logged-in', existance);
            };
        }

        return {
            link: function ($scope, $elem, $attrs) {
                SessionService.on(SessionService.EVENT.LOGIN, manage_login_class($elem, true));
                SessionService.on(SessionService.EVENT.LOGOUT, manage_login_class($elem, false));
                SessionService.on(SessionService.EVENT.ERROR, manage_login_class($elem, false));
            }
        };
    }
]);
