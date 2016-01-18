import {map, each, remove} from 'lodash';
import deep = require('deep-get-set');

const M_SPACES: RegExp = / /g;
const M_DASHES: RegExp = /-+/g;
const M_NON_LETTERS: RegExp = /[^a-zA-Z\d-]/g;

export function pluck<T>(prop: string): (obj: any) => T {
    return function (obj: any) {
        return obj[prop];
    };
}

export function assert(val: any, message?: string): Boolean {
    if (!val) {
        throw new Error(message || 'Assertion error: value not set');
    }

    return true;
}

export module scope {
    export function set<T>($scope: any, prop: string, forced_value?: T): (val: T) => T {
        return function (val: T): T {
            deep<T>($scope, prop, forced_value !== undefined ? forced_value : val);
            return val;
        };
    }

    export function not_found($scope: Object): Function {
        return function (val) {
            (<any>$scope).vm.not_found = !val;
            assert(val);
            return val;
        };
    }
}

export function noop() {
}

export function newNoop(): Function {
    return function () {};
}

export function def<T>(check: T, def_val: T): T {
  return check !== undefined ? check : def_val;
}

export function guid(): String {
    function s4(): String {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return [s4(), s4(), '-', s4(), '-', s4(), '-', s4(), '-', s4(), s4(), s4()].join('');
}

export function preload(url: string, callback: any | Function):HTMLImageElement {
    var img: HTMLImageElement = new Image();
    img.onload = callback;
    img.onerror = callback;
    img.src = url;
    return img;
}

export function opCallback(callback?: Function): Function {
    return callback || noop;
}

export function simplify(str: string): string {
    return str.toLowerCase()
        .replace(M_SPACES, '-')
        .replace(M_DASHES, '-')
        .replace(M_NON_LETTERS, '');
}

export function ellipsis(str: string, max_len: number, suffix: string = '...'): string {
    if (str.length > max_len) {
        str = str.substr(0, max_len).trim() + suffix;
    }

    return str;
}

export function stringify(params: any): string {
    return map(params, function (val: string, key: string): string {
        return [key, encodeURIComponent(val)].join('=');
    }).join('&');
}

export function html(tag: string, props?: any): string {
    return [
        '<', tag, props ? ' ' : '',
            map(props, function (val, key) {
                return key + '="' + val + '"';
            }).join(' '),
        '></', tag, '>'
    ].join('');
}

export function summaryze(text: string): string {
    var paragraphs = text.split('\n');
    return paragraphs[0];
}
