/**
 */
angular.module('tcp').directive('imgUpload', [
    'Dropzone',
    'Webcam',
    'i18n',
    function (Dropzone, Webcam, i18n) {
        'use strict';

        var template = [
            '<div class="img-upload">',
            '    <div class="img-upload__webcam"></div>',
            '</div>',
        ].join('');

        /**
         * @param {Angular.Scope} scope
         * @param {jQuery} elem
         * @param {Angular.Attributes} attrs
         * @return {void}
         */
        function link(scope, elem, attrs) {
            Webcam.reset();

            Webcam.set({
                width: 320,
                height: 240,
                dest_width: 640,
                dest_height: 480,
            });

            Webcam.attach(elem.find('.img-upload__webcam').get(0));
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {void}
         */
        function controller($scope) {
            $scope.$on('$destroy', Webcam.reset.bind(Webcam));

            $scope.snap = function () {
                Webcam.snap(function (data) {
                });
            };
        }

        return {
            scope: {},
            link: link,
            template: template,
            controller: ['$scope', controller]
        };
    }
]);
