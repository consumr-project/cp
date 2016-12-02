/**
 * @attribute {Object} api populated with functions
 */
angular.module('tcp').directive('imgUpload', [
    'Services',
    'Dropzone',
    'Webcam',
    'i18n',
    'utils',
    'utils2',
    'assert',
    'messages',
    function (Services, Dropzone, Webcam, i18n, utils, utils2, assert, messages) {
        'use strict';

        var BASE64_CLEAN = /^data:image\/(png|jpg|jpeg);base64,/;

        var UPLOAD_CONFIG = {
            url: '/service/user/upload',
            previewTemplate: '<span class="img-upload__act__preview"><img data-dz-thumbnail /></span>',
            autoProcessQueue: false,
            uploadMultiple: false,
            maxFilesize: 10,
        };

        var WEBCAM_CONFIG = {
            height: 320,
            width: 350,
            dest_height: 320,
            dest_width: 350,
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

            '                <div class="img-upload__act__preview" ng-show="!vm.running_cam"></div>',
            '            </td>',
            '        </tr>',
            '        <tr ng-show="vm.show_controls">',
            '            <td colspan="2" class="img-upload__footer">',
            '                <button i18n="admin/submit"',
            '                    ng-click="submit()"',
            '                    ng-disabled="!vm.can_submit"></button>',
            '                <button i18n="admin/cancel"',
            '                    class="button--link"',
            '                    ng-click="cancel()"></button>',
            '                <span class="status--error">{{vm.error_msg}}</span>',
            '                <span class="status--success">{{vm.success_msg}}</span>',
            '                <span ng-show="vm.loading_msg" class="status--message loading--spinner padding-right-large">{{vm.loading_msg}}</span>',
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
            var api, img_file, img_data;

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
                show_controls: false,
                running_cam: false,
                error_msg: null,
                loading_msg: null,
                success_msg: null,
            };

            function start_cam() {
                if (scope.vm.running_cam) {
                    return;
                }

                scope.vm.running_cam = true;
                Webcam.attach(webcam_node);
            }

            function stop_cam() {
                scope.vm.running_cam = false;
                Webcam.reset();
            }

            function take_photo() {
                Webcam.snap(set_img_data);
            }

            function reset_images() {
                utils2.try_func(function () {
                    upload.removeFile(img_file);
                });

                reset_snapshot_image();

                img_file = null;
                img_data = null;
            }

            /**
             * @return {jQuery}
             */
            function reset_snapshot_image() {
                return elem.find('.img-upload__webcam .img-upload__act__preview')
                    .empty();
            }

            /**
             * @param {string} data
             */
            function set_snapshot_data(data) {
                var img = angular.element('<img />')
                    .attr('src', data);

                reset_snapshot_image().append(img);
            }

            /**
             * @param {string} data_url
             * @return {string}
             */
            function clean_img_data(data_url) {
                return data_url.replace(BASE64_CLEAN, '');
            }

            /**
             * @param {string} data
             */
            function set_img_data(data) {
                reset_images();
                stop_cam();
                set_snapshot_data(data);

                img_data = data;

                scope.vm.can_submit = true;
                scope.vm.show_controls = true;
                scope.$apply();
            }

            /**
             * @param {File} file
             */
            function set_img_file(file) {
                reset_images();

                img_file = file;

                scope.vm.can_submit = true;
                scope.vm.show_controls = true;
                scope.$apply();
            }

            function submit() {
                assert(img_file || img_data);

                scope.vm.can_submit = false;
                scope.vm.error_msg = null;
                scope.vm.success_msg = null;
                scope.vm.loading_msg = i18n.get('user/uploading_photo');

                upload.off('complete');
                upload.off('success');
                upload.off('error');

                if (img_file) {
                    upload.on('complete', function () {
                        scope.vm.loading_msg = null;
                        scope.vm.can_submit = true;
                        scope.$apply();
                    });

                    upload.on('success', function () {
                        scope.vm.success_msg = i18n.get('user/uploaded_photo');
                        refresh();
                    });

                    upload.on('error', function (file, body, res) {
                        scope.vm.error_msg = messages.from_http_error(i18n, res.status);
                        scope.$apply();
                    });

                    upload.uploadFile(img_file);
                } else if (img_data) {
                    Services.user.upload_avatar(clean_img_data(img_data))
                        .then(function () {
                            scope.vm.loading_msg = null;
                            scope.vm.can_submit = true;
                            scope.vm.success_msg = i18n.get('user/uploaded_photo');
                            refresh();
                        })
                        .catch(function (res) {
                            console.log(res);
                            scope.vm.loading_msg = null;
                            scope.vm.can_submit = true;
                            scope.vm.error_msg = messages.from_http_error(i18n, res.status);
                        });
                }
            }

            function refresh() {
                angular.element('.avatar__image').each(function () {
                    var $this = angular.element(this);
                    var image = $this.css('background-image');
                    var url = image.substring(5, image.length - 2) + '&' + Date.now();
                    var new_image = ['url("', url, '")'].join('');
                    $this.css('background-image', new_image);
                });
            }

            function cancel() {
                stop_cam();
                upload.removeAllFiles(true);
                scope.vm.can_submit = false;
                scope.vm.show_controls = false;
                scope.vm.running_cam = false;
            }

            if (attrs.api) {
                api = deep(scope, attrs.api) || deep(scope, '$parent.' + attrs.api) || {};
                api.reset = function () {
                    reset_images();
                };
            }
        }

        /**
         * @param {Object} obj
         * @param {String} property path
         * @param {*} [val]
         * @return {*}
         */
        function deep(obj, prop, val) {
            var parts = prop.split('.'),
                ref = obj;

            for (var i = 0, len = parts.length; i < len; i++) {
                if (!(parts[i] in ref)) {
                    return;
                }

                ref = ref[parts[i]];
            }

            return val === undefined ? ref : ref = val;
        }

        return {
            scope: true,
            replace: true,
            link: link,
            template: template,
        };
    }
]);
