angular.module('tcp').directive('tcpState', [
    'Session',
    'Navigation',
    '$rootScope',
    'lodash',
    function (Session, Navigation, $rootScope, lodash) {
        'use strict';

        var REGEX_PAGE = /^page--.+/;

        function manage_login_class($elem, existance) {
            return function () {
                $elem.toggleClass('--is-logged-in', existance);
            };
        }

        function update_current_location($elem) {
            return function () {
                $elem.removeClass(function (i, name) {
                    return lodash.filter(name.split(' '), function (name) {
                        return REGEX_PAGE.test(name);
                    }).join(' ');
                });

                $elem.addClass('page--' + Navigation.curr_page());
            };
        }

        return {
            link: function ($scope, $elem, $attrs) {
                Session.on(Session.EVENT.LOGIN, manage_login_class($elem, true));
                Session.on(Session.EVENT.LOGOUT, manage_login_class($elem, false));
                Session.on(Session.EVENT.ERROR, manage_login_class($elem, false));
                $rootScope.$on('$locationChangeStart', update_current_location($elem));
            }
        };
    }
]);
