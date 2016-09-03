'use strict';

const test = require('tape');
const html = require('../../build/html');

const sample_event = `
    (function () {
        var ev = opener.document.createEvent("Events");
        ev.initEvent("sample", true, false);
        opener.document.dispatchEvent(ev);
        window.close();
    })();`.replace(/\s+/g, '');

test('html', t => {
    t.plan(3);

    t.equal('<span>hi</span>', html.h('span', 'hi'));
    t.equal('<span>hihi</span>', html.h('span', ['hi', 'hi']));
    t.equal(sample_event, html.dispatch_event('sample').replace(/\s+/g, ''));
});
