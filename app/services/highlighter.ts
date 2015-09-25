/// <reference path="../typings.d.ts"/>

import {map, find} from 'lodash';
import rangy = require('rangy');

require('rangy/lib/rangy-classapplier');
require('rangy/lib/rangy-highlighter');

const RANGY_OPTION_SEPARATOR: string = '$';

function singleSerialize(hi: rangy.Highlight): string {
    return [
        hi.start,
        hi.end,
        hi.id,
        hi.type,
        hi.container
    ].join(RANGY_OPTION_SEPARATOR);
}

export function serialize(highlighter: rangy.Highlighter): string {
    return JSON.stringify(map(highlighter.highlights, function (hi: rangy.Highlight) {
        return {
            id: hi.id,
            start: hi.characterRange.start,
            end: hi.characterRange.end,
            type: hi.classApplier.className,
            container: hi.containerElementId
        };
    }));
}

export function deserialize(highlighter: rangy.Highlighter, highlights: string): rangy.Highlighter {
    var parsed: Array<rangy.Highlight> = JSON.parse(highlights),
        created: string = create().serialize(),
        serialized: string = [created]
            .concat(map(parsed, singleSerialize))
            .join('|');

    highlighter.deserialize(serialized);
    return highlighter;
}

export function create(className?: string): rangy.Highlighter {
    var highlighter: rangy.Highlighter;

    rangy.init();
    highlighter = rangy.createHighlighter();

    highlighter.addClassApplier(rangy.createClassApplier(className, <rangy.ClassApplierOptions>{
        ignoreWhiteSpace: true,
        tagNames: ['span']
    }));

    highlighter.highlight = function (options?: rangy.HighlightOptions): rangy.Highlight {
        return highlighter.highlightSelection(className, options);
    };

    return highlighter;
}
