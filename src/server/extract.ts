import { Router } from 'express';
import { service_handler } from '../http';
import { extract as p_extract } from '../extract/page';
import { search, infobox, extract as w_extract } from '../extract/wikipedia';

export const router = Router();

router.get('/page', service_handler(req => p_extract(req.query.url)));
router.get('/wiki/search', service_handler(req => search(req.query.q)));
router.get('/wiki/extract', service_handler(req => w_extract(req.query.q)));
router.get('/wiki/infobox', service_handler(req => infobox(req.query.q, req.query.parts)));
