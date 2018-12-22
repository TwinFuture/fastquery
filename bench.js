/*!
 * Fast Query Bench Marking...
 * Fast Query is a lightweight and super fast query string parser for node javascript.
 * Copyright(c) 2018 Alec Johnson | alec_johnson@hotmail.com
 * MIT Licensed
 */
'use strict'
// Include our required modules.
const decode = require('fast-decode-uri-component');

// First lets do a few simple tests and find the best method for splitting string.
// Different methods of splitting a string.
let split = function (str) {
    let aray = str.split('&');
    return aray[1];
}
let indexOf = function (str) {
    let qs = str.indexOf('&', 0);
    return str.substring(qs + 1);
}
let slice = function (str) {
    let queryPrefix = str.indexOf('&')
    return str.slice(queryPrefix + 1);
}
// We didn't include any other methods as these seem to be the fastest
// You can test other methods if you like..
// My results also compare to results reference here
// https://jsperf.com/slice-vs-substr-vs-substring-vs-split-vs-regexp/2
// First Lets test a regex version, pretty simple and sweet regex.
let fastRegex = function (req, sep, eq) {
    if (req === void 0)
        return req;
    // Short and sweet regex, get ?name=blah&age=what.
    sep = sep || '&',
    eq = eq || '=';
    // Lets use this one so we can inject our own sep and eq fields.
    let testRegex = new RegExp(`([^=\/?${sep}]+)${eq}([^=${sep}]*)`, 'g');
    // Short and sweet regex, get ?name=blah&age=what same as above^^.
    // This regex also parses the path /test/home/?custom1=zing&custom2=zoom
    let regex = /([^=?\/&]+)=([^=&]*)/g,
        match,
        fq = {};
    while (match = testRegex.exec(req)) {
        let key = decode(match[1]),
            value = decode(match[2]);
        // Query Strings populated here.
        fq[key] = value;
    }
    // Return the query.
    return fq;
}
// querystring function.
function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
// Querystring
let querystring = function (qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};

    if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
    }

    var regexp = /\+/g;
    qs = qs.split(sep);

    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
    }

    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
    }

    for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr, vstr, k, v;

        if (idx >= 0) {
            kstr = x.substr(0, idx);
            vstr = x.substr(idx + 1);
        } else {
            kstr = x;
            vstr = '';
        }

        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);

        if (!hasOwnProperty(obj, k)) {
            obj[k] = v;
        } else if (Array.isArray(obj[k])) {
            obj[k].push(v);
        } else {
            obj[k] = [obj[k], v];
        }
    }

    return obj;
}
let fastquery = function (fqs, options, sep, eq) {
    sep = sep || '&',
    eq = eq || '=',
    // First lets grab the query string from the req.url.
    fqs = fqs.split('?')[1] || fqs;
    // Anything there?..
    if (fqs === void 0)
        return fqs;
    // Now we split the string by its seperator.
    fqs = fqs.split(sep);
    // Get any options set.. Maybe in the future we can set more...
    // MaxFields default is 100.. use parse(fqs,200); to increase this value.
    let maxFields = 100;
    if (options && typeof options.maxKeys === 'number') {
        maxFields = options.maxKeys;
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

console.log('Testing fastest method for splitting a string...');
// Set our string to be parsed.
let splStr = 'splitmehere&imsplitthere';
let str = 'custom1=zing&custom2=zoom&custom3=blah';
console.log(split(splStr));
console.log(indexOf(splStr));
console.log(slice(splStr));

//// split
let sum = 0;
console.time('split');
for (let i = 0; i < 9000000; i++) {
    sum += split(str)
}
console.timeEnd('split');

//// indexOf
sum = 0;
console.time('indexOf');
for (let i = 0; i < 9000000; i++) {
    sum += indexOf(str)
}
console.timeEnd('indexOf');

//// slice
sum = 0;
console.time('slice');
for (let i = 0; i < 9000000; i++) {
    sum += slice(str);
}
console.timeEnd('slice');
////////////////////////////////////
////////////////////////////////////
console.log('Testing fastest method to parse the query string...');

console.log(fastRegex(str));
console.log(querystring(str));
console.log(fastquery(str));

//// fastRegex
sum = 0;
console.time('fastRegex');
for (let i = 0; i < 9000000; i++) {
    sum += fastRegex(str);
}
console.timeEnd('fastRegex');

//// querystring
sum = 0;
console.time('querystring');
for (let i = 0; i < 9000000; i++) {
    sum += querystring(str);
}
console.timeEnd('querystring');

//// fastquery
sum = 0;
console.time('fastquery');
for (let i = 0; i < 9000000; i++) {
    sum += fastquery(str);
}
console.timeEnd('fastquery');
