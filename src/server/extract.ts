import * as express from 'express';
import config = require('acm');

import { companies } from '../service/extract/crunchbase';
import { extract as p_extract } from '../service/extract/page';
import { search, infobox, extract as w_extract } from '../service/extract/wiki';

export var app = express();

app.get('/page', p_extract);
app.get('/crunchbase/companies', companies);
app.get('/wiki/search', search);
app.get('/wiki/extract', w_extract);
app.get('/wiki/infobox', infobox);
