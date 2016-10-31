/**
 */
angular.module('tcp').directive('imgUpload', [
    'Dropzone',
    'Webcam',
    'i18n',
    function (Dropzone, Webcam, i18n) {
        'use strict';

        function link(scope, elem, attrs) {
        }

        function controller() {
        }

        return {
            scope: {},
            link: link,
            controller: [controller]
        };
    }
]);
