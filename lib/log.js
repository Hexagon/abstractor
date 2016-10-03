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

var log = new function () {
	this.destination = console;
	this.error = function (module, data) {
		if (data !== undefined) this.destination.error("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > error", data);
		else this.destination.log("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > error");
	};
	this.info = function (module, msg, data) {
		if (data !== undefined) this.destination.log("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > " + msg, data);
		else this.destination.log("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > " + msg);
	};
	this.warning = function (module, data) {
		if (data !== undefined) this.destination.warning("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > warning", data);
		else this.destination.warning("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > warning");
	};
	this.throw = function (module, data) {
		if (data !== undefined) {
			throw this.destination.error("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > error", data);
		} else {
			throw this.destination.error("[" + new Date().toLocaleString() + "] " + module.toUpperCase() + " > error");
		}
	}
};

module.exports = log;