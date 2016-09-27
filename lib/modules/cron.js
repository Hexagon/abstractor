// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const
	Pipe = require("../pipe.js"),
	Croner = require("croner");

class Cron extends Pipe {

	constructor(parameters) {
		
		var defaults = {
			pattern: "* * * * * *",
			options: {
				maxRuns: undefined,
				startAt: undefined,
				stopAt: undefined
			},
			message: {}
		};

		super(parameters, defaults);

		var self = this;
		Croner(this.config.pattern, this.config.options, function () {
			self.trigger("success", self.config.message);
		});
		
	}

}

module.exports = Cron;