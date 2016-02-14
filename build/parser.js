"use strict";
var lodash_1 = require('lodash');
var uri = require('urijs');
var DEBUG = 0;
var PART_START = '{{';
var PART_END = '}}';
var PART_INFOBOX_ITEM = '| ';
var REGEX_SECTION_META = /\|.+/g;
var REGEX_INFOBOX_ITEM_LABEL = /\|(.+?)\=/;
var REGEX_INFOBOX_ITEM_CONTENT = /\|.+?\=\s{0,}(.+)/;
(function (Tag) {
    Tag[Tag["INFOBOX"] = 0] = "INFOBOX";
})(exports.Tag || (exports.Tag = {}));
var Tag = exports.Tag;
;
function guess_type(line) {
    return line.substr(0, 2);
}
function new_store() {
    return [];
}
function pad(str, len, use) {
    if (len === void 0) { len = 6; }
    if (use === void 0) { use = '0'; }
    var diff = len - str.toString().length;
    return !diff ? str.toString() :
        new Array(diff + 1).join(use) + str;
}
function prep_lines(markup) {
    return markup.split('\n')
        .filter(function (line) { return !!line; })
        .map(function (line) { return line.trim(); });
}
function contains(str, needle) {
    return str.indexOf(needle) !== -1;
}
function clean_match(match) {
    return match && match[1] ? match[1].trim() : '';
}
function urls(line) {
    var store = [];
    uri.withinString(line, function (url) {
        return store.push(url.replace(REGEX_SECTION_META, ''));
    });
    return store;
}
exports.urls = urls;
function infobox(lines) {
    var curr;
    return lodash_1.reduce(lines, function (dict, line) {
        var label, content;
        switch (guess_type(line)) {
            case PART_INFOBOX_ITEM:
                label = line.match(REGEX_INFOBOX_ITEM_LABEL);
                content = line.match(REGEX_INFOBOX_ITEM_CONTENT);
                curr = clean_match(label);
                if (curr) {
                    dict[curr] = clean_match(content);
                }
                break;
            default:
                if (curr) {
                    dict[curr] += "\n" + line.trim();
                }
                break;
        }
        return dict;
    }, {});
}
exports.infobox = infobox;
function wikitext(markup) {
    if (markup === void 0) { markup = ''; }
    var level = 0;
    var lines = prep_lines(markup), store = new_store();
    var article = {
        parts: (_a = {},
            _a[Tag.INFOBOX] = [],
            _a
        )
    };
    lines.map(function (line, index) {
        function log() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (DEBUG) {
                args.unshift("[" + pad(index) + "]");
                console.log.apply(console, args);
            }
        }
        switch (guess_type(line)) {
            case PART_START:
                level++;
                log({ part: 'PART_START', level: level, line: line });
                if (level === 1) {
                    store = new_store();
                }
                store.push(line);
                if (contains(line, PART_END)) {
                    store = new_store();
                    level--;
                    log({ part: 'PART_START--PART_END', level: level });
                }
                break;
            case PART_END:
                level--;
                log({ part: 'PART_END', level: level, line: line });
                if (level < 1) {
                    article.parts[Tag.INFOBOX].push(store);
                    store = new_store();
                }
                break;
            default:
                store.push(line);
                log({ part: 'DEFAULT', level: level, line: line });
                if (contains(line, PART_START)) {
                    level++;
                    log({ part: 'DEFAULT--PART_START', level: level });
                }
                if (contains(line, PART_END)) {
                    level--;
                    log({ part: 'DEFAULT--PART_END', level: level });
                }
                break;
        }
    });
    return article;
    var _a;
}
exports.wikitext = wikitext;
;
