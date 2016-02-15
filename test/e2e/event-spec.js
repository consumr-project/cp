describe('event', () => {
    /* global $, navigation */
    'use strict';

    beforeEach(() => {
        navigation.company('walmart');
        $('[i18n="event/add"]').click();
    });

    it('automatically gets article information', () => {
        $('#source_1_url')
            .sendKeys('http://www.bbc.com/news/election-us-2016-35572261');

        expect($('#event_title').getAttribute('value'))
            .toEqual('Trump tangles with rivals in Republican debate knockabout - BBC News');

        expect($('#event_date').getAttribute('value'))
            .toEqual('2016-02-13');

        expect($('#event_source_0_source').getAttribute('value'))
            .toEqual('http://www.bbc.com/news/election-us-2016-35572261');

        expect($('#event_source_0_title').getAttribute('value'))
            .toEqual('Trump tangles with rivals in Republican debate knockabout - BBC News');

        expect($('#event_source_0_date').getAttribute('value'))
            .toEqual('2016-02-13');
    });

    it('clears everything upon cancellation', () => {
        $('#source_1_url')
            .sendKeys('http://www.bbc.com/news/election-us-2016-35572261');

        $('.event-elem [i18n="admin/cancel"]')
            .click();

        expect($('#event_title').getAttribute('value'))
            .toEqual('');
    });

    it('can add multiple sources', () => {
        $('.event-elem [i18n="event/add_source"]')
            .click();

        $('#source_1_url')
            .sendKeys('http://www.bbc.com/news/election-us-2016-35572261');

        $('#event_source_1_source')
            .sendKeys('http://www.bbc.com/news/magazine-35559589');

        expect($('#event_source_1_title').getAttribute('value'))
            .toEqual('The first \'friendly fire\' victim of World War One - BBC News');

        expect($('#event_source_1_date').getAttribute('value'))
            .toEqual('2016-02-14');
    });
});
