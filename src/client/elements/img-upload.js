/**
 */
angular.module('tcp').directive('imgUpload', [
    'Dropzone',
    'Webcam',
    'i18n',
    'utils',
    'utils2',
    'assert',
    function (Dropzone, Webcam, i18n, utils, utils2, assert) {
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
            '                    <div class="img-upload__info_icon imgview imgview--plus-black"></div>',
            '                    <div class="img-upload__info_text" i18n="user/upload_photo"></div>',
            '                    <div class="img-upload__info_desc" i18n="user/upload_photo_desc"></div>',
            '                </div>',
            '            </td>',
            '            <td class="img-upload__act img-upload__webcam"',
            '                ng-class="{',
            '                    \'img-upload__webcam--running\': vm.running_cam,',
            '                }"',
            '                ng-click="start_cam()">',
            '                <div class="img-upload__webcam__holder"></div>',
            '                <div ng-click="take_photo()" class="img-upload__webcam__trigger"></div>',

            '                <div class="img-upload__webcam__info">',
            '                    <div class="img-upload__info_icon imgview imgview--camera"></div>',
            '                    <div class="img-upload__info_text" i18n="user/take_photo"></div>',
            '                    <div class="img-upload__info_desc" i18n="user/take_photo_desc"></div>',
            '                </div>',
            '            </td>',
            '        </tr>',
            '        <tr ng-show="vm.can_submit">',
            '            <td colspan="2" class="img-upload__footer">',
            '                <button i18n="admin/submit"',
            '                    ng-click="submit()"',
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
            var webcam_node = elem.find('.img-upload__webcam__holder').get(0);

            var upload = new Dropzone(upload_node, UPLOAD_CONFIG);

            Webcam.reset();
            Webcam.set(WEBCAM_CONFIG);
            utils.preload(Webcam.params.swfURL);

            upload.on('addedfile', set_img_file);

            scope.$on('$destroy', cancel);
            scope.start_cam = start_cam;
            scope.take_photo = take_photo;
            scope.cancel = cancel;
            scope.submit = submit;

            scope.vm = {
                can_submit: false,
                running_cam: false,
            };

            function start_cam() {
                if (scope.vm.running_cam) {
                    return;
                }

                scope.vm.running_cam = true;
                Webcam.attach(webcam_node);
            }

            function take_photo() {
                Webcam.snap(set_img_data);
            }

            /**
             * @param {string} data
             */
            function set_img_data(data) {
                img_data = data;
                img_file = null;

                scope.vm.can_submit = true;
                scope.$apply();
            }

            /**
             * @param {File} file
             */
            function set_img_file(file) {
                utils2.try_func(function () {
                    upload.removeFile(img_file);
                });

                img_file = file;
                img_data = null;

                scope.vm.can_submit = true;
                scope.$apply();
            }

            function submit() {
                assert(img_file || img_data);

                // img_file;
                // img_data;
                // Webcam;
                // upload;
                // debugger;

                if (img_file) {
                    upload.uploadFile(img_file);

                    upload.on('complete', function () {
                        console.log('img_file complete');
                    });

                    upload.on('success', function () {
                        console.log('img_file success');
                    });

                    upload.on('error', function () {
                        console.log('img_file error');
                    });
                // } else if (img_data) {
                }

                cancel();
            }

            function cancel() {
                Webcam.reset();
                upload.removeAllFiles(true);
                scope.vm.can_submit = false;
                scope.vm.running_cam = false;
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
