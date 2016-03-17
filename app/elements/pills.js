/**
 * @attribute {Object[]} selections
 * @attribute {Function} query
 * @attribute {Function} create
 * @attribute {String} labelAttr attribute to use in selections to get labels
 * @attribute {String} idAttr attribute to use in selections to get ids
 * @attribute {String} typeAttr attribute to use in selections to get types
 * @attribute {String} placeholder i18n key to use to get the placeholder
 */
angular.module('tcp').directive('pills', ['$document', 'i18n', 'lodash', function ($document, i18n, _) {
    'use strict';

    /* globals performance */

    var ROLE_REMOVE = 'remove',
        ROLE_SELECT = 'select',
        ROLE_CREATE = 'create';

    /**
     * @return {Number}
     */
    function now() {
        return 'performance' in window && performance.now ?
            performance.now() : Date.now();
    }

    /**
     * @param {angular.Attributes} $attrs
     * @param {String} value
     * @return {Object}
     */
    function create_it($attrs, value) {
        return {
            allowed: !!$attrs.create,
            value: _.trim(value),
            human: i18n.get('common/create_this', { name: value })
        };
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
                _.zipObject([attr(config, 'id')],[id])));
    }

    /**
     * @param {angular.Scope} $scope
     * @param {angular.Attributes} $attrs
     * @param {jQuery} $elem holder
     * @param {jQuery} $input field
     * @param {jQuery.Event} $ev
     */
    function command($scope, $attrs, $elem, $input, $ev) {
        switch ($ev.target.dataset.pillsRole) {
            case ROLE_REMOVE:
                $scope.selections = without(
                    $scope.selections,
                    $ev.target.dataset.pillsData,
                    $attrs
                );
                $input.focus();
                break;

            case ROLE_SELECT:
                $scope.selections.push({
                    id: $ev.target.dataset.pillsOptionId,
                    type: $ev.target.dataset.pillsOptionType,
                    label: $ev.target.dataset.pillsOptionLabel
                });
                $scope.options = unselected($scope.selections, $scope.options, $attrs);
                $input.val('');
                $input.focus();
                break;

            case ROLE_CREATE:
                if (create_it($attrs).allowed) {
                    create($scope, $elem, $input, $input.val());
                }
                break;

            default:
                $input.focus();
                break;
        }
    }

    /**
     * @param {angular.Scope} $scope
     * @param {jQuery} $elem holder
     * @param {jQuery} $input field
     * @param {String} value
     */
    function create($scope, $elem, $input, value) {
        $elem.addClass('loading--spinner');
        $input.attr('disabled', true);

        $scope.create({
            value: value,
            done: function (err, option) {
                if (!err) {
                    $scope.selections.push(option);
                    $scope.options = null;
                }

                $elem.removeClass('loading--spinner');
                $input.attr('disabled', false);
                $input.val('');
            }
        });
    }

    /**
     * @param {angular.Scope} $scope
     * @param {angular.Attributes} $attrs
     * @param {jQuery} $elem holder
     * @param {jQuery} $input field
     * @param {jQuery.Event} $ev
     */
    function query($scope, $attrs, $elem, $input, $ev) {
        var start, value;

        if ($input.data('pillsLastValue') === $ev.target.value) {
            return;
        }

        start = now();
        value = $ev.target.value;

        $input.data('pillsLastValue', $ev.target.value);
        $elem.addClass('loading--spinner');

        $scope.query({
            query: value,
            done: function (err, options) {
                if (!err) {
                    options = unselected($scope.selections, options, $attrs);
                    $scope.options = options;
                    $scope.stats = stats(options, start);
                    $scope.create_it = create_it($attrs, value);
                }

                $elem.removeClass('loading--spinner');
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
        selected = _.map(selected, 'id');

        _.each(selected, function (id) {
            available = without(available, id, config);
        });

        return available;
    }

    function controller($scope, $attrs) {
        $scope.placeholder = $attrs.placeholder && i18n.get($attrs.placeholder);
        if (!$scope.selections) {
            $scope.selections = [];
        }

        $scope.$watchCollection('selections', function (selections) {
            $scope.pills = normalize(selections, $attrs);
            $scope.empty = !$scope.pills.length;
        });
    }

    function link($scope, $elem, $attrs) {
        var $input = $elem.find('input');

        $elem.click(command.bind(null, $scope, $attrs, $elem, $input));
        $input.keyup(_.debounce(query.bind(null, $scope, $attrs, $elem, $input), 300));
        $input.one('keydown', function () {
            $elem.addClass('pills--changed');
        });

        $document.on('focus', '*', check_if_should_hide_results);
        $document.click(check_if_should_hide_results);

        $scope.$on('$destroy', function () {
            $document.off('focus', '*', check_if_should_hide_results);
            $document.off('click', check_if_should_hide_results);
        });

        function check_if_should_hide_results(ev) {
            if (!$elem.has(ev.target).length) {
                $scope.options = null;
                $scope.$apply();
            }
        }
    }

    return {
        replace: true,
        controller: ['$scope', '$attrs', controller],
        link: link,
        scope: {
            selections: '=',
            query: '&',
            create: '&',
        },
        template: [
            '<div class="pills-container is-non-selectable" ng-class="{\'pills--empty\': empty}">',
                '<div class="pills-element">',
                    '<div class="pills-element__selections">',
                        '<div class="pills-element__selections__placeholder" ',
                            'ng-show="empty">{{placeholder}}</div>',
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
                    '<input class="pills-element__input" />',
                '</div>',
                '<div class="pills-results" ng-if="!!options">',
                    '<div class="pills-results__stats">{{stats.human}}</div>',
                    '<div ',
                        'ng-if="!create_it.allowed && !options.length" ',
                        'class="pills-results__no_results" ',
                        'i18n="common/no_results" ',
                        'data="{query: create_it.value}"',
                    '>hi</div>',
                    '<div ',
                        'ng-if="create_it.value && create_it.allowed" ',
                        'class="pills-results__create"',
                        'data-pills-role="create" ',
                        'data-pills-option-label="{{::create_it.value}}" ',
                    '>{{create_it.human}}</div>',
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
        ].join('')
    };
}]);
