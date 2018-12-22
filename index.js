/*!
 * Fast Query
 * Fast Query is a lightweight and super fast query string parser for node javascript.
 * Copyright(c) 2018 Alec Johnson | alec_johnson@hotmail.com
 * MIT Licensed
 */
'use strict'

// Require our modules.
// Faster than decodeURIComponent, without throwing errors on invalid escapes, returns null instead.
const decode = require('fast-decode-uri-component');

// Our Query Parse function.
let parse = function (fqs, options, sep, eq) {
    sep = sep || '&',
    eq = eq || '=',
    // First lets grab the query string from the req.url.
    fqs = fqs.split('?')[1] || fqs;
    // We can also parse/test/home/custom1=zing&custom2=zoom&custom3=blah
    // But this limits our custom sep and eq so its best to pass with and ?
    // fqs = fqs.split('?')[1] || fqs.split('/')[1].pop() || fqs;
    // Anything there?..
    if (fqs === void 0)
        return fqs;
    // Now we split the string by its seperator.
    fqs = fqs.split(sep);
    // Get any options set.. Maybe in the future we can set more...
    // MaxFields default is 100.. use parse(fqs,200); to increase this value.
    let maxFields = 100;
    if (options && typeof options.maxFields === 'number') {
        maxFields = options.maxFields;
    }
    let len = fqs.length,
    q = {};
    // If there are more fields than defined they will be stripped from the result.
    if (maxFields > 0 && len > maxFields)
        len = maxFields;
    // For each field in the query split by the eq.
    for (var i = 0; i < len; ++i) {
        let p = fqs[i].split(eq),
        // Key and value of the fields.
        k = decode(p[0]),
        v = decode(p[1]);
        // Populate query field with key / value decoded...
        q[k] = v;
    }
    return q;
}

module.exports = {
    parse: parse
};