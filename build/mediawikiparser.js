"use strict";
var PART_START = '{{';
var PART_END = '}}';
var REGEX_INFOBOX_SECTION = /\s?\|\s?(.+)[\s]{0,}=/;
(function (Tag) {
    Tag[Tag["Infobox"] = 0] = "Infobox";
})(exports.Tag || (exports.Tag = {}));
var Tag = exports.Tag;
;
function guess_type(line) {
    return line.substr(0, 2);
}
function new_store() {
    return [];
}
function prep_lines(markup) {
    return markup.split('\n')
        .filter(function (line) { return !!line; })
        .map(function (line) { return line.trim(); });
}
function contains(str, needle) {
    return str.indexOf(needle) !== -1;
}
function parse(markup) {
    if (markup === void 0) { markup = ''; }
    var level = 0;
    var lines = prep_lines(markup), store = new_store();
    var article = {
        parts: (_a = {},
            _a[Tag.Infobox] = [],
            _a
        )
    };
    lines.map(function (line, index) {
        function log() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            args.unshift("[" + index + "]");
            console.log.apply(console, args);
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
                    article.parts[Tag.Infobox].push(store);
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
    console.log(article.parts[Tag.Infobox][0]);
    var _a;
}
exports.parse = parse;
;
