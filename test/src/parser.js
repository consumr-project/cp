'use strict';

const test = require('tape');
const each = require('lodash').each;
const parser = require('../../build/parser');

const dataset = {
    'samples/albertsons.wikitext': {
        name: 'Albertsons Companies Inc.<ref name="albertsons.com">{{cite web|url=http://www.albertsons.com/albertsons-files-registration-statement-for-proposed-initial-public-offering/|title=Albertsons  » Albertsons Files Registration Statement for Proposed Initial Public Offering|work=Albertsons|accessdate=5 January 2016}}</ref><ref name="albertsons.com1">{{cite web|url=http://www.albertsons.com/our-company/traditions-history/|title=Albertsons  » About Us|work=Albertsons|accessdate=5 January 2016}}</ref>',
        homepage: '[http://www.albertsons.com/ Albertsons.com]',
        urls: [ 'http://www.albertsons.com/' ],
    },

    'samples/dell.wikitext': {
        name: 'Dell Inc.',
        homepage: '{{URL|https://www.dell.com/}}',
        urls: [ 'https://www.dell.com/' ],
    },

    'samples/apple.wikitext': {
        name: 'Apple Inc.',
        homepage: '{{URL|http://www.apple.com}}',
        urls: [ 'http://www.apple.com' ],
    },

    'samples/nike.wikitext': {
        name: 'Nike, Inc.',
        homepage: '{{URL|http://www.Nike.com}}',
        urls: [ 'http://www.Nike.com' ],
    },

    'samples/walmart.wikitext': {
        name: 'Wal-Mart Stores, Inc.',
        homepage: '{{ublist |{{URL|http://corporate.walmart.com/|Corporate website}}|{{URL|http://www.walmart.com/|Commercial website}}}}',
        urls: [ 'http://corporate.walmart.com/', 'http://www.walmart.com/' ],
    },
};

test('mediawikiparser', t => {
    var raw, article, infobox, urls;

    t.plan(4 * Object.keys(dataset).length);

    each(dataset, (expected, file) => {
        raw = read(file);

        t.comment(`can parse ${file}`);
        article = parser.wikitext(raw);
        t.ok(article.parts[parser.Tag.INFOBOX][0], 'main infobox');

        t.comment('gets sections');
        infobox = parser.infobox(article.parts[parser.Tag.INFOBOX][0]);
        t.equal(infobox.name, expected.name, 'finds name');
        t.equal(infobox.homepage, expected.homepage, 'finds homepage');

        t.comment('can parse content');
        urls = parser.urls(infobox.homepage);
        t.deepEqual(urls, expected.urls, 'finds all urls');
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
