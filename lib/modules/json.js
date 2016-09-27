// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const
	Pipe = require("../pipe.js");

class Json extends Pipe {

	invoke(msg) {
		
		let self = this,
			result;

		// ToDo, headers should have a default, and be passed to this.getConfig

		// Parse if we got a string
		if ( typeof msg.payload == "string" ) {

			try {
				result = JSON.parse(msg.payload);
				self.success( msg, result );
			} catch ( e ) {
				self.error( msg, "Could not parse string as JSON: " + e);
			}

		// Stringify if we got an object
		} else if ( typeof msg.payload == "object" ) {

			try {
				result = JSON.stringify(msg.payload);
				self.success( msg, result );
			} catch ( e ) {
				self.error( msg, "Could not stringify object to JSON: " + e);
			}

		} else {
			return self.error(msg, "JSON node could not determine what to do with payload of type " + typeof msg.payload);

		}
		

	}

}

module.exports = Json;