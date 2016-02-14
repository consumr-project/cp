'use strict';

const test = require('tape');
const each = require('lodash').each;
const parser = require('../../build/parser');

const dataset = {
    'samples/apple.wikitext': {
        name: 'Apple Inc.',
        homepage: '{{URL|http://www.apple.com}}',
    },

    'samples/nike.wikitext': {
        name: 'Nike, Inc.',
        homepage: '{{URL|http://www.Nike.com}}',
    },

    'samples/walmart.wikitext': {
        name: 'Wal-Mart Stores, Inc.',
        homepage: '{{ublist |{{URL|http://corporate.walmart.com/|Corporate website}}|{{URL|http://www.walmart.com/|Commercial website}}}}',
    },
};

test('mediawikiparser', t => {
    var raw, article, infobox;

    t.plan(3 * Object.keys(dataset).length);

    each(dataset, (expected, file) => {
        raw = read(file);

        t.comment(`can parse ${file}`);
        article = parser.wikitext(raw);
        t.ok(article.parts[parser.Tag.INFOBOX][0], 'main infobox');

        t.comment('gets sections');
        infobox = parser.infobox(article.parts[parser.Tag.INFOBOX][0]);
        t.equal(infobox.name, expected.name, 'finds name');
        t.equal(infobox.homepage, expected.homepage, 'finds homepage');
    });
});

/**
 * @param {String} file
 * @return {String} content
 */
function read(file) {
    return require('fs')
        .readFileSync(`${__dirname}/${file}`)
        .toString();
}
