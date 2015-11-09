describe('keyword', function () {
    'use strict';

    var assert = require('assert');
    var keyword = require('../../../build/app/services/keyword');

    it('extracts strings', function () {
        assert(keyword.get('test') === 'test');
    });

    it('extracts plain objects', function () {
        assert(keyword.get({label: 'test'}, 'label') === 'test');
    });

    it('extracts "class" objects', function () {
        assert(keyword.get(new function () { this.label = 'test'; }, 'label') === 'test');
    });

    it('normalizes strings', function () {
        assert.deepEqual(keyword.normalize(['a', 'b', 'c']), ['a', 'b', 'c']);
    });

    it('normalizes objects', function () {
        assert.deepEqual(keyword.normalize([
            { label: 'a' },
            { label: 'b' },
            { label: 'c' }
        ], 'label'), ['a', 'b', 'c']);
    });

    it('normalizes strings and objects', function () {
        assert.deepEqual(keyword.normalize([
            { label: 'a' },
            'b',
            { label: 'c' }
        ], 'label'), ['a', 'b', 'c']);
    });

    it('sorts in alphabetical order', function () {
        assert.deepEqual(keyword.normalize(['c', 'b', 'a']), ['a', 'b', 'c']);
    });

    it('returns lower cased words', function () {
        assert.deepEqual(keyword.normalize(['C', 'B', 'A']), ['a', 'b', 'c']);
    });
});
