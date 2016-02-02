import * as express from 'express';
import config = require('acm');

import { companies as crunchbase_companies } from './crunchbase';
import { search as wiki_search, extract as wiki_extract } from './wiki';
import { extract as page_extract } from './page';

export var app = express();

app.get('/page', page_extract);
app.get('/crunchbase/companies', crunchbase_companies);
app.get('/wiki/search', wiki_search);
app.get('/wiki/extract', wiki_extract);

if (!module.parent) {
    app.listen(config('port') || 3000);
}
