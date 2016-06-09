'use strict';

class I18n {
    constructor(strs) {
        strs = strs || {};
        this.registers = {};
        Object.keys(strs).forEach(key => this.registers[key] = strs[key]);
    }

    get(key, fields) {
        return Object.keys(fields).reduce((str, field) => {
            return str.replace('{' + field + '}', fields[field]);
        }, this.registers[key]);
    }
}

module.exports = I18n;
