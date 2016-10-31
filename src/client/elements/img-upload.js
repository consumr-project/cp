/**
 */
angular.module('tcp').directive('imgUpload', [
    'Dropzone',
    'Webcam',
    'i18n',
    function (Dropzone, Webcam, i18n) {
        'use strict';

        var UPLOAD_CONFIG = {
            url: '/service/extract/page'
        };

        var WEBCAM_CONFIG = {
            width: 320,
            height: 240,
            dest_width: 640,
            dest_height: 480,
        };

        var template = [
            '<div class="img-upload">',
            '    <div class="img-upload__upload"></div>',
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
            var upload_node = elem.find('.img-upload__upload').get(0);
            var webcam_node = elem.find('.img-upload__webcam').get(0);

            var upload = new Dropzone(upload_node, UPLOAD_CONFIG);
            var webcam = Object.create(Webcam);

            webcam.reset();
            webcam.set(WEBCAM_CONFIG);
            webcam.attach(webcam_node);

            scope.upload = upload;
            scope.webcam = webcam;
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
