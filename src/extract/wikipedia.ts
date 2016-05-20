import { ServiceRequestHandler } from 'cp';
import { WikipediaResult, WikipediaRequest, WikipediaResponsePage,
    WikipediaExtract, WikipediaSearchResult } from 'wikipedia';

import { BadGatewayError } from '../errors';
import { get_or_else, get_url_parts, service_handler } from '../utilities';
import { get, filter, map, includes, head } from 'lodash';

import { Tag, wikitext as parse_wikitext, infobox as parse_infobox,
    urls as parse_urls } from './parser';

import config = require('acm');
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

function api<T>(params: WikipediaRequest, parser: (WikipediaResult) => T) {
    return new Promise<T>((resolve, reject) => {
        params.action = 'query';
        params.format = 'json';

        request({
            uri: WIKIPEDIA_API_URL,
            qs: params
        }, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }

            try {
                resolve(parser(JSON.parse(body)));
            } catch (err) {
                reject(new BadGatewayError('could parse response from wikipedia'));
            }
        });
    });
}

function web<T>(params: WikipediaRequest, parser: (string) => T) {
    return new Promise<T>((resolve, reject) => {
        request({
            uri: WIKIPEDIA_WEB_URL,
            qs: params
        }, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(parser(body));
        });
    });
}

export function extract(query: string): Promise<WikipediaResult> {
    return api<WikipediaResult>({
        prop: 'extracts',
        exintro: '',
        explaintext: '',
        titles: query,
    }, body => head(map(get<WikipediaResult[]>(body, 'query.pages'), normalize_extract)));
}

export function search(query: string): Promise<WikipediaResult> {
    return api<WikipediaResult[]>({
        list: 'search',
        srprop: 'snippet',
        srlimit: '50',
        srsearch: query,
    }, body => map(get<WikipediaResult[]>(body, 'query.search'), normalize_search_result));
}

export function infobox(query: string, rparts: string): Promise<Object> {
    return web({
        action: 'raw',
        title: query,
    }, body => {
        var requested = get_url_parts(rparts),
            parts: any = {};

        var article = parse_wikitext(body) || { parts: {} },
            infobox = parse_infobox(head(article.parts[Tag.INFOBOX])) || {};

        if (includes(requested, PART_URLS)) {
            parts.urls = parse_urls(infobox['homepage']);
        }

        return { parts, infobox };
    });
}

export const extract_handler: ServiceRequestHandler = service_handler(req =>
    extract(req.query.q));

export const search_handler: ServiceRequestHandler = service_handler(req =>
    search(req.query.q));

export const infobox_handler: ServiceRequestHandler = service_handler(req =>
    infobox(req.query.q, req.query.parts));
