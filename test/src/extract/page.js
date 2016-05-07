'use strict';

const test = require('tape');
const page = require('../../../build/extract/page');

const keywords_and_entities = [
    [
        { name: 'AONE' },
        { name: 'AONE' },
        { name: 'btwo' },
        { name: 'cthrEE' },
    ],
    [
        { name: 'DfouR' },
        { name: 'btwo' },
        { name: 'cthrEE' },
        { name: 'AONE' },
    ],
    [
        { name: 'AONE' },
        { name: 'AONE' },
        { name: 'btwo' },
        { name: 'cthrEE' },
    ],
    [
        { name: 'DfouR' },
        { name: 'btwo' },
        { name: 'cthrEE' },
        { name: 'AONE' },
    ]
];

test('page extraction', t => {
    t.plan(1);

    t.deepEqual(
        ['aone', 'btwo', 'cthree', 'dfour'],
        page.make_keywords.apply(null, keywords_and_entities)
    );
});
