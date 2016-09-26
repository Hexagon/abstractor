// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const	Pipe = require("../pipe.js");

class Strip extends Pipe {

	invoke(msg) {

		var self = this;

		if (this.config.member) {
			msg[this.config.member] = undefined;
		}

		if (this.config.members) {
			this.config.members.forEach(function(member) {
				msg[self.config.member] = undefined;
			});
		}
		
		this.trigger("success", msg);

	}

}

module.exports = Strip;