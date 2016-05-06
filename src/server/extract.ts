import * as express from 'express';
import config = require('acm');

import { companies } from '../extract/crunchbase';
import { extract as p_extract } from '../extract/page';
import { search, infobox, extract as w_extract } from '../extract/wiki';

export var app = express();

app.get('/page', p_extract);
app.get('/crunchbase/companies', companies);
app.get('/wiki/search', search);
app.get('/wiki/extract', w_extract);
app.get('/wiki/infobox', infobox);
