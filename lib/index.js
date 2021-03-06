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

var extend = require("util")._extend,
    Node = require("./node.js"),
    Log = require("./log.js"),
    fs = require("fs");

function Abstractor(_config) {
    
    // Default configuration
    var config = {
            logLevel: 4
        },

        nodes = {},

        log,

        root = this,

        use = function (lib) {
            var found = false,
                exists = false,
                path = "./nodes/"+lib+".js";

            if ( !nodes[lib] ) {

                // Try built-in if the file exists
                try {
                    exists = fs.statSync(__dirname + "/" + path);
                } catch (x) {
                    exists = false;
                }

                if( exists && exists.isFile() ) {
                    found = true;
                    try {
                        nodes[lib] = require(path);
                    } catch (z) {
                        log.throw("core", "Requested node \"" + lib + "\" could not be imported. Check that its dependecies is installed.\n\nStack:\n\n"+  z.stack);
                    }
                }

                if ( !found ) {
                    try {
                        // Try external
                        nodes[lib] = require(lib);
                    } catch (y) {
                        log.throw("core", "Requested node \"" + lib + "\" not available (2). Try `npm install " + lib + "`\n\n");
                    }
                }
            }
        },

        init = function (__config) {

            // Check that supplied configuration is valid
            if (typeof __config == "object" || __config == undefined) {

                config = extend(config, _config);

                // Allow overriding logger
                log = new Log({
                    destination: config.logger || console,
                    logLevel: config.logLevel
                });

            // Fail ...
            } else {
                
                // We need to create a fallback logger
                log = new Log({
                    destination: console,
                    level: 3
                });

                log.throw("core", TypeError("Supplied configuration not valid, must be object or undefined. Supplied type: " + typeof _config));
            }

            // Allow chaining
            return root;

        },
        createNode = function (lib, nodeConfig) {

            // nodeConfig is optional
            if ( nodeConfig == undefined ) {
                nodeConfig = {};
            }

            // Nodeconfig doesn't need to be an object, but if it is, extend it with certain abstractor settings
            if (typeof nodeConfig == "object") {
                // Currently only logLevel is inherited from abstractor to node
                nodeConfig = extend({ logLevel: config.logLevel }, nodeConfig);
            }

            if ( !nodes[lib] ) {
                use( lib );
                if ( nodes[lib] ) {
                    config.debug && log.log("core", "Imported node " + lib + " on the fly.");  
                }
            }

            if ( nodes[lib] ) {
                var node = new nodes[lib](nodeConfig);
                node.log = log;
                return node;
            } else {
                log.throw("core", Error("Could not create new " + lib + " node, is it available?"));
            }

        };

    // Optional "new"
    if (!(this instanceof Abstractor)) {
        return new Abstractor(_config);
    }

    // Go!
    init(_config);

    if (config.debug) log.log( "core", "Abstractor ready");

    return createNode;

}

Abstractor.Node = Node;

// "Singleton"
module.exports = Abstractor;
