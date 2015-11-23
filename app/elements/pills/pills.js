/**
 * @attribute {Object[]} selections
 * @attribute {String} labelAttr attribute to use in selections to get labels
 * @attribute {String} idAttr attribute to use in selections to get ids
 * @attribute {String} typeAttr attribute to use in selections to get types
 */
angular.module('tcp').directive('pills', ['lodash', function (_) {
    'use strict';

    var ROLE_REMOVE = 'remove',
        ROLE_SELECT = 'select';

    /**
     * @return {Number}
     */
    function now() {
        return 'performance' in window && performance.now ?
            performance.now() : Date.now();
    }

    /**
     * stats object
     * @param {Array} retults
     * @param {Number} start time
     * @return {Object} count and time props
     */
    function stats(results, start) {
        return {
            count: results.length,
            time: (now() - start).toFixed(4).replace('.0000', '')
        };
    }

    /**
     * get an attribute overwrite
     * @param {Object} config
     * @param {String} label
     * @return {String}
     */
    function attr(config, label) {
        return config[label + 'Attr'] || label;
    }

    /**
     * @param {Object[]} selections
     * @param {Object} config
     * @return {Object[]}
     */
    function normalize(selections, config) {
        var labelAttr = attr(config, 'label'),
            typeAttr = attr(config, 'type'),
            idAttr = attr(config, 'id');

        return _.map(selections, function (selection) {
            return {
                id: selection[idAttr],
                type: selection[typeAttr],
                label: selection[labelAttr]
            };
        });
    }

    /**
     * @param {Object[]} selections
     * @param {String} id
     * @param {Object} config
     * @return {Object[]}
     */
    function without(selections, id, config) {
        return _.without(selections,
            _.find(selections,
                _.zipObject([[attr(config, 'id'), id]])));
    }

    /**
     * @param {angular.Scope} $scope
     * @param {angular.Attributes} $attrs
     * @param {jQuery} $input field
     * @param {jQuery.Event} $ev
     */
    function command($scope, $attrs, $input, $ev) {
        var data = $ev.target.dataset.pillsData;

        switch ($ev.target.dataset.pillsRole) {
            case ROLE_REMOVE:
                console.log('removing %s', data);
                $scope.selections = without($scope.selections, data, $attrs);
                break;

            case ROLE_SELECT:
                console.log('selecting %s', data);
                break;

            default:
                $input.focus();
                break;
        }
    }

    /**
     * @param {angular.Scope} $scope
     * @param {angular.Attributes} $attrs
     * @param {jQuery} $input field
     * @param {jQuery.Event} $ev
     */
    function query($scope, $attrs, $input, $ev) {
        if ($input.data('pillsLastValue') === $ev.target.value) {
            return;
        }

        var start = now();
        $input.data('pillsLastValue', $ev.target.value);
        $input.addClass('loading');

        $scope.query($ev.target.value, function (err, options) {
            $scope.options = normalize(options, $attrs);
            $scope.stats = stats(options, start);
            $scope.$apply();
            $input.removeClass('loading');
        });
    }

    function controller($scope, $attrs) {
        $scope.$watchCollection('selections', function (selections) {
            $scope.pills = normalize(selections, $attrs);
        });

// XXX
function randopt() { return { label: Math.random().toString().substr(0, 15), id: Math.random().toString() }; }
$scope.selections = _.times(100, randopt);
$scope.query = function (str, cb) { setTimeout(function () { cb(null, _.times(parseInt(Math.random()*100), randopt)); }, 2000); };
    }

    function link($scope, $elem, $attrs) {
        var $input = $elem.find('input');
        $elem.click(command.bind(null, $scope, $attrs, $input));
        $input.keyup(_.debounce(query.bind(null, $scope, $attrs, $input), 300));
    }

    return {
        replace: true,
        template: [
            '<div class="pills-container is-non-selectable">',
                '<div class="pills-element">',
                    '<div class="pills-element__selections">',
                        '<div ',
                            'class="pills-element__pill" ',
                            'ng-repeat="pill in pills" ',
                            'data-pill-id="{{::pill.id}}" ',
                            'data-pill-type="{{::pill.type || \'regular\'}}"',
                        '>',
                            '<span class="pills-element__pill__label">{{::pill.label}}</span>',
                            '<span data-pills-role="remove" data-pills-data="{{::pill.id}}" ',
                                'class="pills-element__pill__remove"></span>',
                        '</div>',
                    '</div>',
                    '<input class="pills-element__input no-interaction" />',
                '</div>',
                '<div class="pills-results" ng-if="options.length">',
                    '<div class="pills-results__stats">',
                        '<span class="pills-results__stats__stat">{{stats.count}} (res)</span>',
                        '<span class="pills-results__stats__stat">{{stats.time}} (ms)</span>',
                    '</div>',
                    '<div ',
                        'class="pills-results__option" ',
                        'ng-repeat="option in options" ',
                        'data-pills-role="select" ',
                        'data-pills-data="{{::option.id}}" ',
                        'data-pills-option-type="{{::option.type || \'regular\'}}" ',
                    '>{{::option.label}}</div>',
                '</div>',
            '</div>'
        ].join(''),
        scope: { selections: '=', query: '&', },
        controller: ['$scope', '$attrs', controller],
        link: link
    };
}]);
