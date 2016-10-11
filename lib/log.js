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
    colors = require("colors"),
    extend = require("util")._extend;

function Log(config) {

    // Extend defaults
    //   level  0 = silent
    //          1 = error
    //          2 = warning
    //          3 = log
    //          4 = notice
    //          5 = verbose
    config = extend({
        logLevel: 4,
        destination: console
    }, config);

    // Private
    var self = this,
        printEntry = function (fn, module, data, verboseData) {

        let dateTimeStr = "",
            moduleStr = module.toUpperCase(),
            separatorStr = "\t> ",
            typeStr = fn.replace("warning","warn") + "\t",
            dataStr = data,
            complete = moduleStr + separatorStr + typeStr;

        // Append colors if writing to console
        if ( config.destination === console) {

            // Only print date if output is console
            dateTimeStr = " [ " + new Date().toLocaleString() + " ] ";
            complete = moduleStr + separatorStr;

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

        // Check that destination.fn exists, fallback to destination.log
        //console.log(config.destination[fn]);
        let origFn = fn;
        fn = (config.destination[fn] || config.destination.log).bind(config.destination);

        //fn(complete, dataStr, (config.logLevel >= 5 ? verboseData || "" : ""));
        fn(complete, dataStr, (config.logLevel >= 5 ? verboseData || "" : ""));
        
    };

    // Public
    this.error = function (module, data, msg, _localConfig) {
        let _config = extend(config, _localConfig);
        if( _config.logLevel >= 1) printEntry("error", module, data, msg);
        process.exitCode = 1;
    };
    this.log = function (module, data, msg, _localConfig) {
        let _config = extend(config, _localConfig);
        if( _config.logLevel >= 3) printEntry("info", module, data, msg);
    };
    this.notice = function (module, data, msg, _localConfig) {
        let _config = extend(config, _localConfig);
        if( _config.logLevel >= 4) printEntry("info", module, data, msg);
    };
    this.warning = function (module, data, msg, _localConfig) {
        let _config = extend(config, _localConfig);
        if(_config.logLevel >= 2) printEntry("warning", module, data);
    };
    this.throw = function (module, err) {
        printEntry("error", module, err);
        throw err || Error("Unspecifed error");
    };
    
};

module.exports = Log;