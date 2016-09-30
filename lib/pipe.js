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
	qbus = require("qbus"),
	log = require("./log.js");

class Pipe {

	constructor(parameters, defaults) {

		this.bus = new qbus();

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
		this.bus.on(event, function() {
			
			// Qbus passes payload (message) second to last, we want it first
			let tmpMsg = arguments[arguments.length - 2],
				callback = arguments[arguments.length - 1];

			arguments[arguments.length - 2] = arguments[0],
			arguments[0] = tmpMsg;

			// Run callback before invoking actual function
			callback();

			// Invoke destination. Remove callback from argument list before passing it
			destination._invoke.apply(destination, Array.prototype.slice.call(arguments,0,-1));
			
		});
	}

	configure(key, value) {
		this.config[key] = value;
	}

	trigger(event, msg, callback) {
		
		// I WAS HERE!
		if (msg && !msg.__trace) {
			msg.__trace = [];
		} 
		if (msg) {
			msg.__trace.push(this.uuid);
		}

		// Print dedug info
		if (this.config.debug && event == "error") {
			log.error(this.constructor.name, msg.error);
		} else if (this.config.debug) {
			log.error(this.constructor.name, event, this.config.verbose ? msg : (msg.topic || ""));
		}

		// Place event on private queue, find out if a listener was found, pass callback if requested
		var foundListener = false,
			_callback = function () { foundListener = true; callback && callback() };
		if (this.config.bypass) {
			this.bus.emit(event, this.originalMsg, _callback);
		} else {
			this.bus.emit(event, msg, _callback);
		}

		// We cannot let uhandled errors pass without notice
		// Only needed when debug isnt activated
		if ( event == "error" && !foundListener && !this.config.debug) {
			log.error(this.constructor.name, msg.error);
		}

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
	start() {
		this._invoke && this._invoke.apply(this, arguments);
	}


	traceBack( msg ) {
		return (msg && msg.__trace && msg.__trace.indexOf(this.uuid) !== -1);
	}

	_invoke() {

		// Warning on empty message
		if (arguments[0] === undefined) {
			log.warning(this.constructor.name, "Invoked without message!" );
			arguments[0] = {};
		}

		// Replace incoming message with a copy of itself
		arguments[0] = extend({}, arguments[0]);

		// Save another copy for later use
		this.originalMsg = extend({}, arguments[0]);

		if (this.config.debug) {
			log.info(this.constructor.name, this.config.describe || "invoked", this.config.verbose ? arguments[0] : (arguments[0].topic || "") );
		}

		this.invoke && this.invoke.apply(this, arguments);
	}

}

module.exports = Pipe;