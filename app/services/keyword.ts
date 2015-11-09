/// <reference path="../typings.d.ts"/>

'use strict';

import {invoke, uniq, map, isString} from 'lodash';

type KeywordMaybe = { label?: string } | string;

export function get(keyword: KeywordMaybe, label_prop: string): string {
    return isString(keyword) ? keyword : keyword[label_prop];
}

export function normalize(list: KeywordMaybe[], label_prop: string = 'name'): string[] {
    return invoke(uniq(map(list, keyword => get(keyword, label_prop))), 'toLowerCase').sort();
}
