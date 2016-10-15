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

function cloneObject (source, trace) {

    // No need to copy null, undefined of primitive values
    if ( source === null || source === undefined || source.valueOf() === source) 
        return source;

    // This catches everything else, arrays, objects, strings created with new String etc.
    var copy,
        seed = source.constructor == Date ? source.getTime() : source;

    // Create a copy of the object, with the same constructor
    copy = new source.constructor(seed);

    // Clone properties of source into
    cloneProperties(source, copy, trace);

    return copy;

}

function cloneProperties(source, target, trace) {
    
    var prop,
        key,
        circularIndex,
        isArray,
        isObject;

    for (key in source) {

        prop = source[key];

        // Check that this is an actual property
        if ( !source.hasOwnProperty(key) || prop === undefined )
            continue;

        // Check that the property is writable
        if( !Object.getOwnPropertyDescriptor(source, key).writable )
            continue;

        // Circular reference? Store the circular reference and move on to next property
        circularIndex = trace.source.indexOf(prop);
        if ( circularIndex !== -1 ) {
            target[key] = trace.target[circularIndex];
            continue;
        }

        // Objects and arrays calls for recursion. Do it, and move to next property
        isArray = Array.isArray(prop);
        isObject = !isArray && (prop && typeof prop === "object" && prop.constructor === Object);
        if ( (isArray || isObject) && circularIndex === -1 ) {
            
            trace.source.push(prop);
            trace.target.push(target[key] = isObject ? {} : []);

            clone(prop, target[key], trace);

            continue;
        }

        // Ok, this seem to be a simple value, assign it
        target[key] = cloneObject(prop, trace);

    }
}


function clone (source, target, trace) {

    var isArray,
        isPureObject;

    // For tracking circular references
    trace = trace || { 
        source: [],
        target: []
    };

    // Only do the hard work if source is a "Real" object or array
    isArray = Array.isArray(source);
    isPureObject = !isArray && (source && typeof source === "object"  && source.constructor === Object);

    if (isArray || isPureObject) {

        // Target is optional
        target = target || new source.constructor();

        var prop,
            key,
            circularIndex;

        cloneProperties(source, target, trace);

    } else {

        target = cloneObject(source, trace);

    }

    return target;

} 

module.exports = clone;
