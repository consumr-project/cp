angular.module('tcp').directive('tcpInputs', function () {
    'use strict';

    return {
        scope: {
            'editing': '=tcpInputs'
        },
        link: function (scope, elem, attrs) {
            scope.$watch(attrs.tcpInputs, function (editing) {
                if (editing) {
                    elem.addClass('tcp-inputs-editing');
                    elem.find('textarea').attr('readonly', false);
                    elem.find('input')
                        .attr('readonly', false)
                        .attr('disabled', false);
                } else {
                    elem.removeClass('tcp-inputs-editing');
                    elem.find('textarea').attr('readonly', true);
                    elem.find('input')
                        .attr('readonly', true)
                        .attr('disabled', true);
                }
            });
        }
    };
});
