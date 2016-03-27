angular.module('tcp').directive('tcpState', [
    'Session',
    function (Session) {
        'use strict';

        function manage_login_class($elem, existance) {
            return function () {
                $elem.toggleClass('--is-logged-in', existance);
            };
        }

        return {
            link: function ($scope, $elem, $attrs) {
                Session.on(Session.EVENT.LOGIN, manage_login_class($elem, true));
                Session.on(Session.EVENT.LOGOUT, manage_login_class($elem, false));
                Session.on(Session.EVENT.ERROR, manage_login_class($elem, false));
            }
        };
    }
]);
