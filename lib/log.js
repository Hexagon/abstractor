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

var log = {
	error: function (logger, module, data) {
		if (data !== undefined) logger.error("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > error", data);
		else logger.log("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > error");
	},
	info: function (logger, module, msg, data) {
		if (data !== undefined) logger.log("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > " + msg, data);
		else logger.log("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > " + msg);
	},
	warning: function (logger, module, data) {
		if (data !== undefined) logger.warning("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > warning", data);
		else logger.warning("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > warning");
	},
	throw: function (logger, module, data) {
		if (data !== undefined) {
			throw logger.error("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > error", data);
		} else {
			throw logger.error("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > error");
		}
	}
};

module.exports = log;