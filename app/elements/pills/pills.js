/**
 * @attribute {Object[]} selections
 * @attribute {String} labelAttr attribute to use in selections to get labels
 * @attribute {String} idAttr attribute to use in selections to get ids
 * @attribute {String} typeAttr attribute to use in selections to get types
 */
angular.module('tcp').directive('pills', ['$document', 'i18n', 'lodash', function ($document, i18n, _) {
    'use strict';

    /* globals performance */

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
        var count = results.length,
            time = (now() - start).toFixed(4)
                .replace('.0000', '');

        return {
            time: time,
            count: count,
            human: i18n.get('common/search_stats', { count: count, time: time })
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
        switch ($ev.target.dataset.pillsRole) {
            case ROLE_REMOVE:
                console.log('removing %s', $ev.target.dataset.pillsData);
                $scope.selections = without(
                    $scope.selections,
                    $ev.target.dataset.pillsData,
                    $attrs
                );
                break;

            case ROLE_SELECT:
                console.log('selecting %s', $ev.target.dataset.pillsOptionId);
                $scope.selections.push({
                    id: $ev.target.dataset.pillsOptionId,
                    label: $ev.target.dataset.pillsOptionLabel
                });
                $scope.options = unselected($scope.selections, $scope.options, $attrs);
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

        $scope.query({
            query: $ev.target.value,
            done: function (err, options) {
                if (!err) {
                    options = unselected($scope.selections, options, $attrs);
                    $scope.options = options;
                    $scope.stats = stats(options, start);
                    $scope.$apply();
                }

                $input.removeClass('loading');
            }
        });
    }

    /**
     * get options without the ones that are already selected
     * @param {Object[]} selected
     * @param {Object[]} available
     * @param {Object} config
     * @return {Object[]}
     */
    function unselected(selected, available, config) {
        available = normalize(available, config);
        selected = normalize(selected, config);
        selected = _.pluck(selected, 'id');

        _.each(selected, function (id) {
            available = without(available, id, config);
        });

        return available;
    }

    function controller($scope, $attrs) {
        if (!$scope.selections) {
            $scope.selections = [];
        }

        $scope.$watchCollection('selections', function (selections) {
            $scope.pills = normalize(selections, $attrs);
        });
    }

    function link($scope, $elem, $attrs) {
        var $input = $elem.find('input');
        $elem.click(command.bind(null, $scope, $attrs, $input));
        $input.keyup(_.debounce(query.bind(null, $scope, $attrs, $input), 300));
        $document.click(hideResults);
        $scope.$on('$destroy', function () {
            $document.off('click', hideResults);
        });

        function hideResults(ev) {
            if (!$elem.has(ev.target).length) {
                $scope.options = null;
                $input.val('');
                $scope.$apply();
            }
        }
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
                    '<div class="pills-results__stats">{{stats.human}}</div>',
                    '<div ',
                        'class="pills-results__option" ',
                        'ng-repeat="option in options" ',
                        'data-pills-role="select" ',
                        'data-pills-option-id="{{::option.id}}" ',
                        'data-pills-option-label="{{::option.label}}" ',
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
