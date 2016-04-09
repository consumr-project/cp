import * as express from 'express';
import config = require('acm');

import { companies as crunchbase_companies } from './crunchbase';
import { extract as page_extract } from './page';
import {
    search as wiki_search,
    extract as wiki_extract,
    infobox as wiki_infobox
} from './wiki';

var app = express();

app.get('/page', page_extract);
app.get('/crunchbase/companies', crunchbase_companies);
app.get('/wiki/search', wiki_search);
app.get('/wiki/extract', wiki_extract);
app.get('/wiki/infobox', wiki_infobox);

!module.parent && app.listen(config('port') || 3000);
export = app;
