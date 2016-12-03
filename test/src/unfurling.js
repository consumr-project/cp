'use strict';

const test = require('tape');
const unfurling = require('../../build/unfurling');

test('unfurling url parsing', t => {
    var parsed;

    t.plan(5);

    parsed = unfurling.parse('/company/walmart');
    t.looseEquals(parsed, { model: 'company', guid: 'walmart' }, 'matches company by guid');

    parsed = unfurling.parse('/company/id/73c59d53-158e-4891-95e6-1f8a9a722b5d');
    t.looseEquals(parsed, { model: 'company', id: '73c59d53-158e-4891-95e6-1f8a9a722b5d' }, 'matches company by id');

    parsed = unfurling.parse('/company/id/73c59d53-158e-4891-95e6-1f8a9a722b5d/event/33a16fe2-b913-49aa-babf-2d0c2d080fa8');
    t.looseEquals(parsed, { model: 'event', id: '33a16fe2-b913-49aa-babf-2d0c2d080fa8' }, 'matches event in company url');

    parsed = unfurling.parse('/tag/aa28bb37-62a5-4f8c-8f98-c3ca6125ef75');
    t.looseEquals(parsed, { model: 'tag', id: 'aa28bb37-62a5-4f8c-8f98-c3ca6125ef75' }, 'matches tag by id');

    parsed = unfurling.parse('/whatever');
    t.looseEquals(parsed, {}, 'blank object when no match found');
});
