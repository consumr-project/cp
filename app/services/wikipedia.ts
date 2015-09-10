/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../../typings/q/Q.d.ts"/>

import * as _ from 'lodash';
import * as utils from './utils';
var request = require('reqwest');

declare function reqwest<T>(req: { url: string; type: string; }): Q.Promise<T>;
declare function require(pac: string): any;

declare interface ApiRequestPayload {
    action: string;
    callback?: string;
    exintro?: string;
    explaintext?: string;
    format?: string;
    prop?: string;
    titles?: string;
}

declare interface ApiResponsePayload {
    _matches?: Array<ApiResponsePayload>;
    extract?: string;
    extract_no_refs?: string;
    imageinfo?: Array<{ url: string; }>;
    revisions?: string;
}

const URL: string = 'https://en.wikipedia.org/w/api.php?';

const EXTRACT_LOGO: RegExp = /Infobox[\s+\S+]+\|\s?logo\s{0,}=\s{0,}\[{0,}(.+:[-\w\d\s.]+)/;
const EXTRACT_IMAGE: RegExp = /Infobox[\s+\S+]+\|\s?image\s{0,}=\s{0,}\[{0,}(.+:[-\w\d\s.]+)/;

const EXTRACT_DELIM: string = '\n';
const EXTRACT_REF: string = '^';

/**
 * make a call to wikipedia's api
 */
function api(params: ApiRequestPayload): Q.Promise<ApiResponsePayload> {
    params.format = 'json';
    params.callback = 'JSON_CALLBACK';

    return reqwest<ApiResponsePayload>({
        type: 'jsonp',
        url: URL + utils.stringify(params)
    });
}

function isNotReference(line: string): Boolean {
    return line && line.charAt(0) !== EXTRACT_REF;
}

function best(object: string): (value: any) => ApiResponsePayload {
    return function (res: any): ApiResponsePayload {
        var all: Array<ApiResponsePayload> = res.query[object],
            best: ApiResponsePayload = {};

        for (var id in all) {
            if (!all.hasOwnProperty(id)) {
                continue;
            }

            best = all[id];
            best._matches = all;

            // extract without references
            best.extract_no_refs = best.extract && _.filter(best.extract.split(EXTRACT_DELIM),
                isNotReference).join(EXTRACT_DELIM);

            break;
        }

        return best;
    };
}

/**
 * extract a page's description
 */
export function extract(title: string): Q.Promise<ApiResponsePayload> {
    return api(<ApiRequestPayload>{
        action: 'query',
        prop: 'extracts',
        exintro: '',
        explaintext: '',
        titles: title,
    }).then(best('pages'));
}

/**
 * get a page's revisions
 */
export function revisions(title: string): Q.Promise<ApiResponsePayload> {
    return api(<ApiRequestPayload>{
        action: 'query',
        prop: 'revisions',
        rvprop: 'content',
        titles: title
    }).then(best('pages'));
}

/**
 * get an image's/file's information (url)
 */
export function imageinfo(file: string): Q.Promise<ApiResponsePayload> {
    return api(<ApiRequestPayload>{
        action: 'query',
        prop: 'imageinfo',
        iiprop: 'url',
        titles: file
    }).then(best('pages'));
}

/**
 * get a page's main image
 */
export function image(title: string): Q.Promise<ApiResponsePayload> {
    var def: Q.Deferred<ApiResponsePayload> = Q.defer(),
        req: Q.Promise<ApiResponsePayload> = revisions(title);

    function revolveWithUrl(res: ApiResponsePayload) {
        def.resolve(res.imageinfo ? res.imageinfo[0].url : null);
    }

    req.then(function (res) {
        var file;

        if (!res || !res.revisions) {
            def.resolve(null);
            return;
        }

        file = res.revisions[0]['*'].match(EXTRACT_LOGO) ||
               res.revisions[0]['*'].match(EXTRACT_IMAGE);

        if (!file) {
            def.resolve(null);
            return;
        }

        file = file[1]
            .replace(/ /g, '_')
            .replace(/\s/g, '');

        return imageinfo(file)
            .then(revolveWithUrl);
    });

    return def.promise;
}
