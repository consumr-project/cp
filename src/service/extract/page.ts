import { Request, Response } from 'express';
import { filter, flatten, map, uniq, sortBy as sort } from 'lodash';

import config = require('acm');
import request = require('request');

const EMBED_URL = 'http://api.embed.ly/1/extract';
const EMBED_KEY = config('embedly.api.key');

interface EmbedRequest {
    key: string;
    url: string;
    maxwidth: number;
    maxheight: number;
}

interface EmbedResponse {
    description: string;
    keywords: EmbedScoredWord[];
    entities: EmbedScoredWord[];
    published: string;
    title: string;
    type: string;
    url: string;
}

interface EmbedScoredWord {
    score?: number;
    count?: number;
    name: string;
}

interface PageResponse {
    description: string;
    keywords: string[];
    published: string;
    title: string;
    type: string;
    url: string;
}

function query(req: Request): EmbedRequest {
    return {
        key: EMBED_KEY,
        maxwidth: 1000,
        maxheight: 1000,
        url: req.query.url
    };
}

function parse(body: EmbedResponse): PageResponse {
    return {
        title: body.title,
        published: body.published,
        type: body.type,
        url: body.url,
        description: body.description,
        keywords: make_keywords(body.keywords, body.entities),
    };
}

function all_lowercase(strs: string[]): string[] {
    return map(strs, str => str.toLowerCase());
}

export function make_keywords(...words_arr: EmbedScoredWord[][]): string[] {
    return sort(uniq(all_lowercase(filter(<string[]>map(flatten(words_arr), 'name')))));
}

export function extract(req: Request, res: Response, next: Function) {
    request({
        uri: EMBED_URL,
        qs: query(req)
    }, (err, xres, body) => {
        if (err) {
            next(err);
            return;
        }

        try {
            res.json(<CPServiceResponseV1<PageResponse>>{
                body: parse(JSON.parse(body)),
                meta: { ok: true }
            });
        } catch (ignore) {
            err = new Error('could not parse response');
            next(err);
        }
    });
}
