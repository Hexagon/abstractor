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

    // Log levels
    //    0 = silent
    //    1 = error
    //    2 = warning
    //    3 = log
    //    4 = notice
    //    5 = verbose

    // Private
    var printEntry = function (fn, module, data, verbose) {

        let complete = module.toUpperCase() + " > ";

            // Only provide verbose log if logLevel > 5
            verbose = config.logLevel >= 5 ? (verbose || undefined) : undefined;

        // When writing to console
        if ( config.destination === console) {

            // Compose message
            complete = " [ " + new Date().toLocaleString() + " ] " + complete + data;

            if ( fn == "error" ) 
                complete = complete.bgRed.white;
            else if ( fn == "warning" )
                complete = complete.bgYellow.black

        // ... when writing to a custom log function
        } else {
            complete += fn + ': ' + data;

        }

        // Check that destination.fn exists, fallback to destination.log
        let logger = (config.destination[fn] || config.destination.log).bind(config.destination);

        if ( verbose !== undefined ) {
            logger(complete, verbose);    
        } else {
            logger(complete);
        }
        
        
    };

    // Public
    this.error = function (module, data, msg, _localConfig) {
        let _config = extend(config, _localConfig);
        if( _config.logLevel >= 1) printEntry("error", module, data, msg);

        // Always show that task failed when a error is logged
        // This can be reverted in flow through retry-node
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