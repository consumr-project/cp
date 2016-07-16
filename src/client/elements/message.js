angular.module('tcp').directive('message', [
    'lodash',
    function (_) {
        'use strict';

        return {
            replace: true,
            transclude: true,

            template: function ($elem, $attrs) {
                var closex = !('closable' in $attrs) ? '' :
                    '<div class="close-x is-clickable"></div>';

                return [
                    '<div class="message-elem animated fadeIn">',
                        '<ng-transclude></ng-transclude>',
                        closex,
                    '</div>',
                ].join('');
            },

            $scope: {},

            link: function (scope, elem, attr) {
                elem.addClass('message-elem--' + attr.type);
                elem.find('.close-x').on('click', function () {
                    elem
                        .removeClass('fadeIn')
                        .animate({ opacity: 0 }, 150)
                        .slideUp(400, function () {
                            elem.hide();
                            _.set(scope, elem.attr('ng-show'), false);
                            _.set(scope, elem.attr('ng-if'), false);
                        });
                });
            },
        };
    }
]);
