angular.module('tcp').directive('tcpSummary', ['$compile', 'lodash', function ($compile, _) {
    'use strict';

    /**
     * @param {angular.element} elem
     * @return {String}
     */
    function contentVariable(elem) {
        return elem.text()
            .replace(/\{\{|::|\}\}/g, '');
    }

    /**
     * @param {angular.element} elem
     * @return {String}
     */
    function getSummary(elem, len) {
        var text = _.trim(elem.text()).replace(/\n/g, ' ');

        len = +len;

        if (!text) {
            return '';
        }

        if (text.length > len) {
            text = _.trimRight(text.substr(0, len)) + '...';
        }

        return text;
    }

    return {
        link: function (scope, elem, attrs) {
            var stop = scope.$watch(contentVariable(elem), function () {
                elem.text(getSummary(elem, attrs.tcpSummary));
                stop();
            });

            scope.$watch('$destroy', stop);
        }
    };
}]);
