import { service_handler } from '../utilities';

import Trello = require('trello');
import config = require('acm');

const TRELLO_KEY = config('trello.key');
const TRELLO_TOKEN = config('trello.token');
const TRELLO_LIST_ID = config('trello.list_id');
const TRELLO_BOARD_ID = config('trello.board_id');

export const trello = new Trello(TRELLO_KEY, TRELLO_TOKEN);

export module card {
    export function add(name: string, desc: string) {
        return trello.addCard(name, desc, TRELLO_LIST_ID);
    }

    export function get(id: string) {
        return trello.getCard(TRELLO_BOARD_ID, id);
    }

    export function del(id: string) {
        return trello.deleteCard(id);
    }
}

export const add_card_handler = service_handler(req =>
    card.add(req.body.name, req.body.desc));
