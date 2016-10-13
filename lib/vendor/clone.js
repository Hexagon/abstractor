/* clone

The MIT License (MIT)

Copyright (c) 2016 Pehr Boman, Hexagon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

"use strict";

function cloneObject (source) {

    // Special case for null
    if ( source === null ) return null;

    // Special case for Date
    if ( source.constructor == Date ) {
        return new Date(source.getTime());

    // Special case for every object that is not it's own value
    } else if (source.valueOf() !== source) {

        // ToDo: Copy a string example with custom property
        return source;

    }

    // Absolute fallback for copying anything
    return source;
}

function clone (source, target, trace) {

    var isArray,
        isObject;

    // Target is optional
    target = target || new source.constructor();

    // Only do the hard work if source is a "Real" object or array
    isArray = Array.isArray(source);
    isObject = !isArray && (source && typeof source === "object" && source.constructor === Object );

    if (isArray || isObject) {

        var prop,
            key,
            circularIndex;

        trace = trace || { 
            source: [],
            target: []
        };

        for (key in source) {

            prop = source[key];

            // Ignore undefined and ?
            if (!source.hasOwnProperty(key) || prop === undefined) {
                continue;
            }

            // Circular reference? Store the circular reference and move on to next property
            circularIndex = trace.source.indexOf(prop);
            if (circularIndex !== -1) {
                target[key] = trace.target[circularIndex];
                continue;
            }

            // Objects and arrays calls for recursion. Do it, and move to next property
            isArray = Array.isArray(prop);
            isObject = !isArray && (prop && typeof prop === "object" && prop.constructor === Object);
            if ((isArray || isObject) && circularIndex === -1) {
                
                trace.source.push(prop);
                trace.target.push(target[key] = isObject ? {} : []);

                clone(prop, target[key], trace, root);

                continue;
            }

            // Ok, this seem to be a simple value, assign it
            target[key] = cloneObject(prop);

        }

    } else {

        target = cloneObject(source);

    }

    return target;

} 

module.exports = clone;
