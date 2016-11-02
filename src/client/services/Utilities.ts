import deep = require('deep-get-set');

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
