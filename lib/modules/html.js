// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const 	Pipe = require("../pipe.js"),
		cheerio = require("cheerio"),
		fs = require("fs");

class Html extends Pipe {

	constructor(parameters) {
		
		var defaults = {
			get: "object",
			selector: undefined,
			attribute: undefined
		};

		super(parameters, defaults);

	}

	invoke(msg) {
		
		let self = this,
			$,

			// Optional options
			get = this.getConfig("get", msg, false),
			selector = this.getConfig("selector", msg, false),
			attribute = this.getConfig("attribute", msg, false);

		if ( this.config.selector == undefined )
			return self.error(msg, "HTML need an selector.");
		
		if ( typeof msg.payload !== "string" )
			return self.error(msg, "HTML node could not determine what to do with payload of type " + typeof msg.payload);

		// Parse document
		$ = cheerio.load(msg.payload);

		// Get requested parameter/attribute/value
		if ( get == "object" ) {
			this.success( msg, $(selector))
		} else if ( get == "attribute" ) {
			if ( attribute == undefined )
				return self.error(msg, "Attribute getter needs an attribute.");
			this.success( msg, $(selector).attr(attribute) );
		} else if ( get == "value" ) {
			this.success( msg, $(selector).val())
		} else if ( get == "text" ) {
			this.success( msg, $(selector).text())
		} else if ( get == "html" ) {
			this.success( msg, $(selector).html() );
		} else if ( get == "array" ) {
			this.success( msg, $(selector).toArray() );
		} else {
			return self.error(msg, "HTML node could not determine how to get " + typeof msg.payload);
		}
		
	}

}

module.exports = Html;