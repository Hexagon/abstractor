// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const	Pipe = require("../pipe.js");

class Generic extends Pipe {

	invoke(msg) {

		var self = this;
		
		// Supplied function accepts one argument (should be message, handle as syncronous)
		if ( this.config.fn  ) {

			// We will push two extra arguments onto the stack
			arguments.length += 2;

			// Push success callback onto arguments
			arguments[arguments.length-2] = function(msg) { if( self.config.block !== true ) { self.trigger("success", msg); } };

			// Push error callback onto arguments
			arguments[arguments.length-1] = function(msg) { if( self.config.block !== true ) { self.trigger("success", msg); } };

			// Invoke general function. Did it return something? Instant success!
			var returned = this.config.fn.apply(this, arguments);
			if ( returned ) {
				if( self.config.block !== true ) { self.trigger("success", returned); }
			}

		} else {
			// No function was provided, just pass the message onto next node
			if( this.config.block !== true ) {
				this.trigger("success", msg );	
			}
			
		}
		
	}

}

module.exports = Generic;