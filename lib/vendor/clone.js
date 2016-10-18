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

function clone (source, target, trace) {

    // No need to copy null, undefined or primitive values
    // Shortest way first
    if (       source === null 
            || source === undefined 
            || (       source.valueOf() === source 
                    && source.constructor !== Object 
                    && !Array.isArray(source)))
        return target = source;

    
    var seed,
        key,
        prop,
        circularReference;

    // Choose seed for new source.constructor
    //  - Default seed is undefined
    if (!target) {
        if (source.constructor === Date) seed = source.getTime();
        else if (!(Array.isArray(source) || source.constructor === Object)) seed = source;    
    }
    target = target || new source.constructor(seed);

    // For tracking circular references
    trace = trace || new WeakMap();

    for (key in source) {

        prop = source[key];

        // Check that this is an actual property
        if ( prop === undefined || !source.hasOwnProperty(key) || !Object.getOwnPropertyDescriptor(source, key).writable )
            continue;

        // Circular reference? Store the circular reference and move on to next property
        if ( circularReference = trace.get(prop) ) {
            target[key] = circularReference;
            continue;
        }

        // Pure objects and arrays need tracing
        if ( prop !== null && (Array.isArray(prop) || prop.constructor === Object) ) {
            trace.set(prop, target[key] = Array.isArray(prop) ? [] : {});
        }

        // Ok, this seem to be a simple value, assign it
        target[key] = clone(prop, target[key], trace);

    }

    return target;

}  

module.exports = clone;
