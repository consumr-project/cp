import {Request, Response} from 'express';
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
    keywords: Array<string>;
    published: string;
    title: string;
    type: string;
    url: string;
}

interface PageResponse {
    description: string;
    keywords: Array<string>;
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
        description: body.description,
        keywords: body.keywords,
        published: body.published,
        title: body.title,
        type: body.type,
        url: body.url
    };
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
            /* res.json(<CPServiceResponseV1<PageResponse>>parse(JSON.parse(body))); */
            res.json(parse(JSON.parse(body)));
        } catch (ignore) {
            err = new Error('could not parse response');
            next(err);
        }
    });
}
