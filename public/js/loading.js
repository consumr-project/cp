'use strict';

angular.module('tcp').directive('tcpLoading', function () {
    return {
        template:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 14 32 18" width="32" height="4" preserveAspectRatio="none" class="tcp-loading">' +
            '  <path opacity="0.8" transform="translate(0 0)" d="M2 14 V18 H6 V14z">' +
            '    <animateTransform attributeName="transform" type="translate" values="0 0; 24 0; 0 0" dur="2s" begin="0" repeatCount="indefinite" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
            '  </path>' +
            '  <path opacity="0.5" transform="translate(0 0)" d="M0 14 V18 H8 V14z">' +
            '    <animateTransform attributeName="transform" type="translate" values="0 0; 24 0; 0 0" dur="2s" begin="0.1s" repeatCount="indefinite" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
            '  </path>' +
            '  <path opacity="0.25" transform="translate(0 0)" d="M0 14 V18 H8 V14z">' +
            '    <animateTransform attributeName="transform" type="translate" values="0 0; 24 0; 0 0" dur="2s" begin="0.2s" repeatCount="indefinite" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />' +
            '  </path>' +
            '</svg>',
        replace: false,
    };
});
