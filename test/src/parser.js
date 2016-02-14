'use strict';

const test = require('tape');
const parser = require('../../build/parser');

const samples = [
    read('samples/walmart.wikitext'),
];

test('mediawikiparser', t => {
    var article = parser.wikitext(samples[0]);
    var infobox = parser.infobox(article.parts[parser.Tag.INFOBOX][0]);

    // console.log(article.parts[parser.Tag.INFOBOX][0]);
    console.log(infobox);

    t.plan(1);
    t.equal('walmart.com', 'walmart.com');
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
