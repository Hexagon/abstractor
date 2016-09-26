// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const	Pipe = require("../pipe.js"),
		fs = require("fs");

class Kill extends Pipe {

	constructor(parameters) {
		
		var defaults = {
			exitCode: 0
		};

		super(parameters, defaults);

	}

	invoke(msg) {

		var filePath = this.getConfig("exitCode", msg, true);

		process.exit(this.config.exitCode);

	}

}

module.exports = Kill;