import { scalar } from './lang';

export function h(tag: string, content: scalar | scalar[]) {
    var str = '';

    if (content instanceof Array) {
        str = content.join('');
    } else {
        str = content.toString();
    }

    return `<${tag}>${str}</${tag}>`;
}

export function dispatch_event(name: string) {
    return `
        (function () {
            var ev = opener.document.createEvent("Events");
            ev.initEvent("${name}", true, false);
            opener.document.dispatchEvent(ev);
            window.close();
        })();
    `;
}
