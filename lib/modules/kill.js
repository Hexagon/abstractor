// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const
	Pipe = require("../pipe.js");

class Kill extends Pipe {

	constructor(parameters) {
		
		var defaults = {
			exitCode: 0
		};

		super(parameters, defaults);

	}

	invoke(msg) {

		var exitCode = this.getConfig("exitCode", msg, true);

		process.exit(exitCode);

	}

}

module.exports = Kill;