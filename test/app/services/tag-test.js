describe('tag', function () {
    'use strict';

    var assert = require('assert');
    var tag = require('../../../build/app/services/tag');

    it('extracts strings', function () {
        assert(tag.get('test') === 'test');
    });

    it('extracts plain objects', function () {
        assert(tag.get({label: 'test'}, 'label') === 'test');
    });

    it('extracts "class" objects', function () {
        assert(tag.get(new function () { this.label = 'test'; }, 'label') === 'test');
    });

    it('normalizes strings', function () {
        assert.deepEqual(tag.normalize(['a', 'b', 'c']), ['a', 'b', 'c']);
    });

    it('normalizes objects', function () {
        assert.deepEqual(tag.normalize([
            { label: 'a' },
            { label: 'b' },
            { label: 'c' }
        ], 'label'), ['a', 'b', 'c']);
    });

    it('normalizes strings and objects', function () {
        assert.deepEqual(tag.normalize([
            { label: 'a' },
            'b',
            { label: 'c' }
        ], 'label'), ['a', 'b', 'c']);
    });

    it('sorts in alphabetical order', function () {
        assert.deepEqual(tag.normalize(['c', 'b', 'a']), ['a', 'b', 'c']);
    });
});
