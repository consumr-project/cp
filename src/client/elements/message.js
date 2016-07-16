angular.module('tcp').directive('message', [
    'lodash',
    function (_) {
        'use strict';

        return {
            replace: true,
            transclude: true,

            template: function ($elem, $attrs) {
                var closex = !('closable' in $attrs) ? '' :
                    '<div ng-click="close()" class="close-x"></div>';

                var opentag = !('closable' in $attrs) ?
                    '<div class="message-elem animated fadeIn">' :
                    '<div ng-show="open" class="message-elem animated fadeIn">';

                return [
                    opentag,
                    '<ng-transclude></ng-transclude>',
                    closex,
                    '</div>',
                ].join('');
            },

            link: function (scope, elem, attr) {
                elem.addClass('message-elem--' + attr.type);

                scope.close = function () {
                    _.set(scope, elem.attr('ng-if'), false);
                };
            },

            controller: ['$scope', function ($scope) {
                $scope.open = true;
            }],
        };
    }
]);
