/// <reference path="../../config/typings.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../../typings/q/Q.d.ts"/>
/// <reference path="../../typings/tcp.d.ts"/>

import * as _ from 'lodash';
import {stringify, html} from './utils';
import reqwest = require('reqwest');

interface MediaDescription {
    type: TYPE;
    html: string;
}

interface ImageDescription {
    width: number;
    url: string;
}

interface ApiResponsePayload {
    content: string;
    contentParts: Array<string>;
    description: string;
    images: Array<string> | Array<ImageDescription>;
    keywords: Array<string> | Array<{ name: string; }>;
    media: MediaDescription;
    orig_content: string;
    orig_images: Array<string> | Array<ImageDescription>;
    orig_keywords: Array<string> | Array<{ name: string; }>;
    type: string;
    url: string;
}

export class TYPE {
    static ARTICLE: string = 'article';
    static ERROR: string = 'error';
    static PHOTO: string = 'photo';
    static RICH: string = 'rich';
    static VIDEO: string = 'video';
}

const URL = 'http://api.embed.ly/1/extract?';
const KEY = TCP_BUILD_CONFIG.embedly.key;

const MIN_IMAGE_WIDTH = 500;
const MICROSOFT_EXTENSIONS: Array<string> = ['doc', 'docx', 'xlsx', 'pptx'];

let node = document.createElement('div');

export function fetch(url: string): Q.Promise<ApiResponsePayload> {
    return reqwest<ApiResponsePayload>({
        type: 'jsonp',
        url: URL + stringify({
            callback: 'JSON_CALLBACK',
            key: KEY,
            maxheight: 1000,
            maxwidth: 1000,
            url: url
        })
    })
        .then(normalize)
        .then(microsoft_media);
}

function normalize(content: ApiResponsePayload): ApiResponsePayload {
    node.innerHTML = content.content || content.description;

    content.orig_content = content.content;
    content.orig_images = content.images;
    content.orig_keywords = content.keywords;

    content.content = _.trim(node.innerText);
    content.contentParts = content.content.split('\n');
    content.keywords = _.pluck<string>(<Array<string>>content.keywords, 'name');

    content.images = <Array<string>>_(<Array<ImageDescription>>content.images)
        .filter(is_image_of_right_size)
        .pluck('url')
        .uniq()
        .value();

    return content;
}

function microsoft_media(content: ApiResponsePayload): ApiResponsePayload {
    if (!content.type && is_microsoft_extension(content.url)) {
        content.media = {
            type: TYPE.RICH,
            html: html('iframe', {
                src: `https://view.officeapps.live.com/op/view.aspx?src=${content.url}`
            })
        };
    }

    return content;
}

function is_image_of_right_size(content: ImageDescription): Boolean {
    return content.width > MIN_IMAGE_WIDTH;
}

function is_microsoft_extension(name: string): Boolean {
    var ext_index = _.lastIndexOf(name, '.'),
        ext = name.substr(ext_index + 1);

    return MICROSOFT_EXTENSIONS.indexOf(ext) !== -1;
}
