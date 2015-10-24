/// <reference path="../typings.d.ts"/>

import {map, each, remove} from 'lodash';

const M_SPACES: RegExp = / /g;
const M_DASHES: RegExp = /-+/g;
const M_NON_LETTERS: RegExp = /[^a-zA-Z\d-]/g;

export interface Listener {
    trigger(name: any, args?: Array<any>);
    on(name: any, handler: Function): Function;
    listener?: (obj: any) => any;
}

export function noop() {
}

export function newNoop(): Function {
    return function () {};
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

export function createListener(): Listener {
    var events: Object = {};

    function trigger(name: any, args?: Array<any>) {
        each(events[name], function (fn: Function) {
            fn.apply(null, args || []);
        });
    }

    function on(name: any, handler: Function): Function {
        if (!(name in events)) {
            events[name] = [];
        }

        events[name].push(handler);

        return function () {
            remove(events[name], function (fn) {
                return handler === fn;
            });
        };
    }

    function listener(obj: any): any {
        obj.on = on;
        obj.trigger = trigger;
        return obj;
    }

    return {
        listener: listener,
        on: on,
        trigger: trigger,
    };
}
