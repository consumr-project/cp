/**
 */
angular.module('tcp').directive('imgUpload', [
    'Dropzone',
    'Webcam',
    'i18n',
    function (Dropzone, Webcam, i18n) {
        'use strict';

        var UPLOAD_CONFIG = {
            url: '/service/user/upload',
            previewTemplate: '<span></span>',
            autoProcessQueue: false,
        };

        var WEBCAM_CONFIG = {
            dest_width: 640,
            dest_height: 480,
        };

        var template = [
            '<div class="img-upload">',
            '    <table>',
            '        <tr>',
            '            <td colspan="2">',
            '                <div class="img-upload__header" i18n="user/update_photo"></div>',
            '            </td>',
            '        </tr>',
            '        <tr>',
            '            <td class="img-upload__act img-upload__upload">',
            '                <div class="img-upload__upload__info">',
            '                    <div class="img-upload__info_text" i18n="user/upload_photo"></div>',
            '                    <div class="img-upload__info_desc" i18n="user/upload_photo_desc"></div>',
            '                </div>',
            '            </td>',
            '            <td class="img-upload__act img-upload__webcam" ng-click="start_cam()">',
            '                <div class="img-upload__webcam__info">',
            '                    <div class="img-upload__info_text" i18n="user/take_photo"></div>',
            '                    <div class="img-upload__info_desc" i18n="user/take_photo_desc"></div>',
            '                </div>',
            '            </td>',
            '        </tr>',
            '    </table>',
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

            scope.upload = upload;
            scope.webcam = webcam;
            scope.webcam_node = webcam_node;
        }

        /**
         * @param {Angular.Scope} $scope
         * @return {void}
         */
        function controller($scope) {
            $scope.$on('$destroy', Webcam.reset.bind(Webcam));

            $scope.start_cam = function () {
                $scope.webcam.attach($scope.webcam_node);
            };

            $scope.take_photo = function () {
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
