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
	Pipe = require("./pipe.js"),
	log = require("./log.js");

function Abstractor(_config) {
	
	// Default configuration
	var config = {
			verbose: false
		},

		nodes = {},

		root = this,

		use = function (lib) {
			var found = false,
				x,y;

			if ( !nodes[lib] ) {
				// Try built-in
				try {
					nodes[lib] = require("./modules/"+lib+".js");
					found = true;
				} catch (_x) {
					x = _x;
				}

				if ( !found ) {
					try {
						// Try external
						nodes[lib] = require(lib);
					} catch (y) {
						log.error("core", "Requested node "" + lib + "" not available. Try `npm install " + lib + "`\n\n" + x.stack + y.stack);
					}
				}
			}
		},

		init = function (__config) {

			// Shorthand of configuration, only list of enabled nodes supplied
			if (Object.prototype.toString.call( __config ) === "[object Array]" ) {
				config.enable = __config;

			// Check that supplied configuration is valid
			} else if (typeof __config == "object" || __config == undefined) {
				config = extend(config, _config);

			// Fail ...
			} else {
				log.error("core", "Supplied configuration not valid, must be object or undefined. Supplied type: " + typeof _config);
			}

			// Import nodes
			if ( config.enable && config.enable.forEach) {
				config.enable.forEach(function (node) {
					use(node);	
				});
			}

			// Allow chaining
			return root;
		};

	// Optional "new"
	if (!(this instanceof Abstractor)) {
		return new Abstractor(_config);
	}

	this.createNode = function (lib, nodeConfig) {

		if ( nodeConfig == undefined ) {
			nodeConfig = {};
		}
		if (typeof nodeConfig == "object") {
			nodeConfig = extend({ verbose: config.verbose, debug: config.debug }, nodeConfig);
		}

		if ( !nodes[lib] ) {
			use( lib );
			if ( nodes[lib] ) {
				log.info("core", "Imported node " + lib + " on the fly.");	
			}
		}
		if ( nodes[lib] ) {
			return new nodes[lib](nodeConfig);
		} else {
			log.error("core", "Could not create new " + lib + " node, is it enabled?");
		}
	}	

	// Go!
	init(_config);
	if ( !config.silent ) {
		log.info( "core", "Abstractor ready");
		if( Object.keys(nodes).length > 0) {
			log.info( "core", "Preimported nodes: ", Object.keys(nodes));
		}
	}

	return this.createNode;

}

Abstractor.pipe = Pipe;

// "Singleton"
module.exports = Abstractor;
