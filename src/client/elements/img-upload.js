/**
 */
angular.module('tcp').directive('imgUpload', [
    'Dropzone',
    'Webcam',
    'i18n',
    'utils',
    function (Dropzone, Webcam, i18n, utils) {
        'use strict';

        var UPLOAD_CONFIG = {
            url: '/service/user/upload',
            previewTemplate: '<span class="img-upload__act__preview"><img data-dz-thumbnail /></span>',
            autoProcessQueue: false,
            uploadMultiple: false,
            maxFilesize: 10,
        };

        var WEBCAM_CONFIG = {
            dest_width: 640,
            dest_height: 480,
        };

        var template = [
            '<div class="img-upload">',
            '    <table>',
            '        <tr>',
            '            <td colspan="2" class="img-upload__header">',
            '                <div i18n="user/update_photo"></div>',
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
            '        <tr>',
            '            <td colspan="2" class="img-upload__footer">',
            '                <button i18n="admin/submit"',
            '                    ng-disabled="!vm.can_submit"></button>',
            '                <button i18n="admin/cancel"',
            '                    class="button--link"',
            '                    ng-click="cancel()"></button>',
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
            var img_file, img_data;

            var upload_node = elem.find('.img-upload__upload').get(0);
            var webcam_node = elem.find('.img-upload__webcam').get(0);

            var upload = new Dropzone(upload_node, UPLOAD_CONFIG);
            var webcam = Object.create(Webcam);

            webcam.reset();
            webcam.set(WEBCAM_CONFIG);
            utils.preload(Webcam.params.swfURL);

            upload.on('addedfile', set_img_file);

            scope.$on('$destroy', cancel);
            scope.start_cam = start_cam;
            scope.take_photo = take_photo;
            scope.cancel = cancel;

            scope.vm = {
                can_submit: false,
            };

            function start_cam() {
                webcam.attach(webcam_node);
            }

            function take_photo() {
                webcam.snap(set_img_data);
            }

            /**
             * @param {string} data
             */
            function set_img_data(data) {
                img_data = data;
                img_file = null;
                scope.vm.can_submit = true;
            }

            /**
             * @param {File} file
             */
            function set_img_file(file) {
                if (img_file) {
                    upload.removeFile(img_file);
                }

                img_file = file;
                img_data = null;
                scope.vm.can_submit = true;
                scope.$apply();
            }

            function cancel() {
                webcam.reset();
                upload.removeAllFiles(true);
            }
        }

        return {
            scope: true,
            replace: true,
            link: link,
            template: template,
        };
    }
]);
