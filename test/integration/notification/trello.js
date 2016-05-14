'use strict';

const tapes = require('tapes');
const trello = require('../../../build/notification/trello');

tapes('trello', t => {
    var card;

    var card_name = '[test] my own card ' + new Date();
    var card_desc = '[test] here is my description';

    t.plan(3);
    t.ok(trello.trello);
    t.ok(trello.trello.key);
    t.ok(trello.trello.token);

    t.test('add card', st => {
        st.plan(4);

        trello.card.add(card_name, card_desc).then(_card => {
            card = _card;
            st.ok(card);
            st.ok(card.id);
            st.ok(card.name === card_name);
            st.ok(card.desc === card_desc);
        });
    });

    t.test('get card', st => {
        st.plan(4);

        trello.card.get(card.id).then(_card => {
            card = _card;
            st.ok(card);
            st.ok(card.id);
            st.ok(card.name === card_name);
            st.ok(card.desc === card_desc);
        });
    });

    t.test('delete card', st => {
        st.plan(1);

        trello.card.del(card.id).then(ack => {
            st.ok(ack);
        });
    });
});
