import * as express from 'express';

import { extract_handler as p_extract_handler } from '../extract/page';
import { search_handler, infobox_handler,
    extract_handler as w_extract_handler } from '../extract/wikipedia';

export var app = express();

app.get('/page', p_extract_handler);
app.get('/wiki/search', search_handler);
app.get('/wiki/extract', w_extract_handler);
app.get('/wiki/infobox', infobox_handler);
