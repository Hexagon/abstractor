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
    uuid = require("node-uuid"),
    qbus = require("qbus");

function deepExtend (target, source, seen) {
    var type = Array.isArray(source) ? 'array' : ((typeof source == 'object' && source.constructor == Object) ? 'object' : 'other'),
        name,
        prop,
        isArray,
        isObject;

    seen = seen || [];

    for (name in source) {
        if (!source.hasOwnProperty(name) || (prop = source[name]) === undefined) {
            continue;
        }

        isArray = Array.isArray(prop);
        isObject = !isArray && (typeof prop === 'object' && prop.constructor === Object);

        if ((isArray || isObject) && !~seen.indexOf(prop)) {
            seen.push(prop);
            target[name] = isObject ? {} : [];
            deepExtend(target[name], prop, seen);
            continue;
        }

        target[name] = prop;
    }

    return target;
}

class Pipe {

    constructor(parameters, defaults) {

        this.bus = new qbus();

        // Default, is overridden by abstractor.createNode
        this.log = console;

        // Message tracking
        // Every instance of a node gets their own uuid, which is appendeded to the _trace array every time a message passes the node
        this._trace = [];
        this.uuid = uuid.v4();

        // Normal operation
        if (typeof parameters == "object" || parameters == undefined) {
            this.config = extend(defaults || {}, parameters);

        // Special case for generic nodes which just pass their function instead of object { fn: function () { ... } }
        } else {
            this.config = defaults || {};
            this.config.fn = parameters;
        }
        this.instant && this.instant();

    }

    on(event, destination) {
        
        var self = this;

        this.bus.on(event, function() {

            // If destination is a node, or a function
            if ( destination._invoke || typeof destination === 'function' ) {

                // Qbus passes payload (message) second to last, we want it first
                let tmpMsg = arguments[arguments.length - 2],
                    callback = arguments[arguments.length - 1];

                // Move the first argument back second to last
                arguments[arguments.length - 2] = arguments[0];

                // Make a deep copy of the incoming message
                tmpMsg = deepExtend({}, tmpMsg);

                // Add trace of old node to new copy of message
                if (tmpMsg.__trace === undefined) tmpMsg.__trace = [];
                tmpMsg.__trace.push(self.uuid);

                // Place new message back in arguments
                arguments[0] = tmpMsg;

                // Run callback before invoking actual function
                callback && callback();

                // Invoke destination node. Remove callback from argument list before passing it
                if ( destination._invoke) {
                    destination._invoke.apply(destination, Array.prototype.slice.call(arguments,0,-1));

                // Run destination function. Remove callback from argument list before passing it
                } else {
                    destination.apply(destination, Array.prototype.slice.call(arguments,0,-1));

                }
                

            // If destination is a string, log it
            } else if (Object.prototype.toString.call(destination) === '[object String]') {
                self.log.log(self.constructor.name, destination);
            
            }

        });

        // Return this for chaining
        return this;

    }

    trigger(event, msg, callback) {

        // Print node description on invocation
        this.log.notice(this.constructor.name, event, this.config.describe ,undefined,this.config);

        // Place event on private queue, find out if a listener was found, pass callback if requested
        var foundListener = false,
            _callback = function () { foundListener = true; callback && callback(); };
        if (this.config.bypass) {
            this.bus.emit(event, this.originalMsg, _callback);
        } else {
            this.bus.emit(event, msg, _callback);
        }

        if( !foundListener && (event == "warning" || event == "error") ) {
            this.log[event](this.constructor.name, "Unhandled " + event + ": " + (msg.error ? msg.error : "") , msg, undefined, this.config);
        } 

        // ALWAYS trigger "always", don't log it though
        this.bus.emit("always", msg, false);

        return foundListener;

    }

    error(msg, errMsg) {
        msg.error = errMsg;
        this.trigger( "error", msg);
    }

    success(msg, payload) {
        msg.payload = payload;
        this.trigger( "success", msg);
    }

    getConfig(entry, msg, mandatory) {

        var result = undefined;

        //  - use msg.`entry` primarily
        if (msg[entry] !== undefined) {
            result = msg[entry];

        // - config.`entry` is used if msg.`entry` is not privided
        } else if (this.config[entry] !== undefined) {
            result = this.config[entry];

        // - abort if we did not get a path at all
        } else {
            if (mandatory) {
                return this.error("Configuration entry `"+entry+"` provided, please supply through msg."+entry+" or <node config>."+entry+".");
            }
        }

        return result;

    }

    // Just a cleaner entry point than _invoke when invoking a node manually
    start(msg) {
        this._invoke(msg || {});
    }

    // Return true if supplied message has visited this node before
    traceback( msg ) {
        return (msg && msg.__trace && msg.__trace.indexOf(this.uuid) !== -1);
    }

    _invoke() {

        // Warning on empty message
        if (arguments[0] === undefined) {
            this.log.warning(this.constructor.name, "Invoked without message!",undefined,this.config);
            arguments[0] = {};
        }

        // Save a copy of message for later use
        if ( !this.traceback(arguments[0]) )
            this.originalMsg = deepExtend({}, arguments[0]);

        // Print node description on invoke, if available
        if ( this.config.describe ) {
            this.log.notice(this.constructor.name, this.config.describe, arguments[0], this.config);
        }

        // Incoke it for real
        this.invoke && this.invoke.apply(this, arguments);
    }

}

module.exports = Pipe;
