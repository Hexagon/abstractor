// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const
	Pipe = require("../pipe.js"),
	extend = require("util")._extend;

class Split extends Pipe {
	
	invoke(msg) {

		// Has the message been here before?
		if ( this.traceBack( msg ) ) {

			// Check if we have got callbacks on all batches
			if (--this.items == 0) { this.trigger( "success", this.originalMsg ); }

		// No message, split payload into batches and trigger "batch" for each chunk
		} else {

			// Keep track of triggered batches
			this.items = 0;

			if ( msg.payload && msg.payload.slice ) {
				for (var i=0; i<msg.payload.length; i++) {
					let msgCopy = extend({}, msg);
					msgCopy.payload = msgCopy.payload.slice(i,i+1);
					if(i===0) this.trigger( "first", this.originalMsg );
					this.trigger( "item", msgCopy );
					this.items++;
				}
			} else {
				this.error( msg, "message.payload has to be an array!");
			}
		}
	}
}

module.exports = Split;