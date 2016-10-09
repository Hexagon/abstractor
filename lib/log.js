/* ------------------------------------------------------------------------------------

  Abstractor - MIT License - Hexagon <github.com/Hexagon>

  Node.js abstraction layer and automation framework.

  ------------------------------------------------------------------------------------

  License:

    MIT:

    Copyright (c) 2016 Hexagon <github.com/Hexagon>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

  ------------------------------------------------------------------------------------  */

"use strict";

var 
    colors = require('colors'),
    Log = new function (destination) {

    // Private
    var printEntry = function (fn, module, data, type) {

        let dateTimeStr = "",
            moduleStr = module.toUpperCase(),
            separatorStr = "\t> ",
            typeStr = (type || fn).replace("warning","warn") + "\t",
            dataStr = data || "",
            complete = moduleStr + separatorStr + typeStr;

        // Append colors if writing to console
        if ( destination === console) {

            // Only print date if output is console
            dateTimeStr = " [ " + new Date().toLocaleString() + " ] ";
            complete = moduleStr + separatorStr

            if ( fn == "error" ) {
                complete = complete.bgRed.white;
                dateTimeStr = dateTimeStr.bgRed.white;
                dataStr = dataStr.bgRed.white;
            } else if ( fn == "warning" ) {
                complete = complete.bgYellow.black;
                dateTimeStr = dateTimeStr.bgYellow.black;
                dataStr = dataStr.bgYellow.black;
            } else {
                dateTimeStr = dateTimeStr.gray;
            }

            complete = dateTimeStr + complete;

        }

        fn = destination[fn] || destination.log;
        fn(complete, dataStr);
  
    };

    // Public
    this.error = function (module, data) {
        printEntry("error", module, data);
    };
    this.info = function (module, data, msg) {
        printEntry("info", module, data, msg);
    };
    this.warning = function (module, data) {
        printEntry("warning", module, data);
    };
    this.throw = function (module, err) {
        printEntry("error", module, err);
        throw err || Error("Unspecifed error");
    };

    // "Constructor"
    destination = destination || console;
    
};

module.exports = Log;