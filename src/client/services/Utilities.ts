import { map } from 'lodash';
import deep = require('deep-get-set');

const M_SPACES: RegExp = / /g;
const M_DASHES: RegExp = /-+/g;
const M_NON_LETTERS: RegExp = /[^a-zA-Z\d-]/g;

export import elem_is_visible = require('true-visibility');

export function pluck<T>(prop: string): (obj: any) => T {
    return function (obj: any) {
        return obj[prop];
    };
}

export function assert(val: any, message?: String | Function): Boolean {
    var err;

    if (!val) {
        err = new Error(<string>message || 'Assertion error: value not set');

        if (message && message instanceof Function) {
            message(err);
        }

        throw err;
    }

    return true;
}

export namespace scope {
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

export function preload(url: string, callback: any | Function):HTMLImageElement {
    var img: HTMLImageElement = new Image();
    img.onload = callback;
    img.onerror = callback;
    img.src = url;
    return img;
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

export function truthy(val: string | Boolean): Boolean {
    return val && (val.toString() === 'true' || val.toString() === '1');
}

export function make_link(link?: string): string {
    if (!link) {
        return '';
    } else {
        return link.indexOf('http') === 0 ? link : 'http://' + link;
    }
}
