import { Request, Response } from 'express';
import { filter, map, includes, head } from 'lodash';
import { get_or_else, get_url_parts } from '../utilities';

import { WikipediaResult, WikipediaRequest, WikipediaSearchResponse,
    WikipediaResponsePage, WikipediaExtract, WikipediaSearchResult } from 'wikipedia';

import { Tag, wikitext as parse_wikitext, infobox as parse_infobox,
    urls as parse_urls } from './parser';

import config = require('acm');
import getset = require('deep-get-set');
import striptags = require('striptags');
import request = require('request');

const WIKIPEDIA_API_URL = config('wikipedia.site.en.api');
const WIKIPEDIA_WEB_URL = config('wikipedia.site.en.web');

const PART_URLS = 'urls';
const CHAR_NL = '\n';
const CHAR_REF = '^';

function normalize_extract(obj: WikipediaResponsePage): WikipediaExtract {
    return {
        id: obj.pageid,
        title: get_or_else(obj.title, ''),
        extract: filter(
            // removes reference lines
            get_or_else(obj.extract, '').split(CHAR_NL),
            line => line[0] !== CHAR_REF
        ).join(CHAR_NL).trim()
    };
}

function normalize_search_result(obj: WikipediaResponsePage): WikipediaSearchResult {
    return {
        title: obj.title,
        snippet: striptags(get_or_else(obj.snippet, ''))
    };
}

function wikipedia_api<T>(req: Request, res: Response, next: Function, params: WikipediaRequest, parser: (WikipediaSearchResponse) => T) {
    var start_time = Date.now();

    params.action = 'query';
    params.format = 'json';

    request({
        uri: WIKIPEDIA_API_URL,
        qs: params
    }, (err, xres, body) => {
        if (err) {
            next(err);
            return;
        }

        try {
            res.json(<CPServiceResponseV1<T>>{
                body: parser(JSON.parse(body)),
                meta: {
                    elapsed_time: Date.now() - start_time,
                    href: xres.request.url.href
                },
            });
        } catch (err) {
            next(err);
        }
    });
}

function wikipedia_web<T>(req: Request, res: Response, next: Function, params: WikipediaRequest, parser: (string) => T) {
    var start_time = Date.now();

    request({
        uri: WIKIPEDIA_WEB_URL,
        qs: params
    }, (err, xres, body) => {
        if (err) {
            next(err);
            return;
        }

        res.json(<CPServiceResponseV1<WikipediaResult>>{
            body: parser(body),
            meta: {
                elapsed_time: Date.now() - start_time,
                href: xres.request.url.href
            },
        });
    });
}

export function extract(req: Request, res: Response, next: Function) {
    wikipedia_api<WikipediaResult>(req, res, next, {
        prop: 'extracts',
        exintro: '',
        explaintext: '',
        titles: req.query.q,
    }, body => map(<WikipediaResult[]>getset(body, 'query.pages'), normalize_extract).pop());
}

export function search(req: Request, res: Response, next: Function) {
    wikipedia_api<WikipediaResult[]>(req, res, next, {
        list: 'search',
        srprop: 'snippet',
        srlimit: '50',
        srsearch: req.query.q,
    }, body => map(<WikipediaResult[]>getset(body, 'query.search'), normalize_search_result));
}

export function infobox(req: Request, res: Response, next: Function) {
    wikipedia_web(req, res, next, {
        action: 'raw',
        title: req.query.q,
    }, body => {
        var requested = get_url_parts(req.query.parts),
            parts: any = {};

        var article = parse_wikitext(body) || { parts: {} },
            infobox = parse_infobox(head(article.parts[Tag.INFOBOX])) || {};

        if (includes(requested, PART_URLS)) {
            parts.urls = parse_urls(infobox['homepage']);
        }

        return { parts, infobox };
    });
}
