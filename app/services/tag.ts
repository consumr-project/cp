/// <reference path="../typings.d.ts"/>

'use strict';

import {uniq, map, isString} from 'lodash';

type TagMaybe = { label?: string } | string;

export function get(tag: TagMaybe, label_prop: string): string {
    return isString(tag) ? tag : tag[label_prop];
}

export function normalize(list: TagMaybe[], label_prop: string = 'name'): string[] {
    return uniq(map(list, tag => get(tag, label_prop))).sort();
}
