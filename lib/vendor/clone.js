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

function cloneProperties(source, target, trace) {

    // For tracking circular references
    trace = trace || { source: [], target: [] };

    for (let key in source) {

        let prop = source[key],
            circularIndex;

        // Check that this is an actual property
        if ( !source.hasOwnProperty(key) || prop === undefined || !Object.getOwnPropertyDescriptor(source, key).writable )
            continue;

        // Circular reference? Store the circular reference and move on to next property
        circularIndex = trace.source.indexOf(prop);
        if ( circularIndex !== -1 ) {
            target[key] = trace.target[circularIndex];
            continue;
        }

        // Objects and arrays calls for recursion. Do it, and move to next property
        if ( prop !== null && (Array.isArray(prop) || prop.constructor === Object) ) {
            
            trace.source.push(prop);
            trace.target.push(target[key] = Array.isArray(prop) ? [] : {});

            clone(prop, target[key], trace);

            continue;
        }

        // Ok, this seem to be a simple value, assign it
        target[key] = clone(prop, undefined,  trace);

    }

    return target;
}


function clone (source, target, trace) {

    // No need to copy null, undefined or primitive values
    // Shortest way first
    if (       source === null 
            || source === undefined 
            || (       source.valueOf() === source 
                    && source.constructor !== Object 
                    && !Array.isArray(source)))
        return target = source;

    // Choose seed for new source.constructor
    //  - Arrays and pure objects want none which is default
    var seed = undefined;

    // - Date need source.getTime() as source would give timezone
    //   inconsistencies
    if (source.constructor === Date)
        seed = source.getTime();

    //  - Everything else want source
    else if (!(Array.isArray(source) || source.constructor === Object))
        seed = source;

    return cloneProperties(source, target = target || new source.constructor(seed), trace);

} 

module.exports = clone;
