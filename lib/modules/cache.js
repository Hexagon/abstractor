/***********************************************************************************

	Abstractor | Cache module | MIT License | ©2016 Hexagon <github.com/hexagon>

	In memory key/value storage, great for storing the last payload
	of a specific topic.

	----------------------------------------------------------------------------

	
	Dependencies

	None


    ----------------------------------------------------------------------------


	Options

	None


    ----------------------------------------------------------------------------


	I/O

	-------------------------------+----------------------+---------------------
	Input                          |  Possible triggers   |  Sets property
	-------------------------------+----------------------+---------------------
	                               |  success             |  payload
	get: <key to get>              +----------------------+---------------------
	                               |  error               |  error
    -------------------------------+----------------------+---------------------
	topic: <key to store>          |  N/A                 |  N/A
	-------------------------------+----------------------+---------------------
	                               |  success	          |  payload
	dump: true                     +----------------------+---------------------
                                   |  error	              |  error
	-------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const	Pipe = require("../pipe.js");

class Cache extends Pipe {

	constructor(parameters) {
		super(parameters);

		this.memory = {};
		
	}

	invoke(msg) {
		
		// Sanity checks
		if ( !msg ) 
			return this.error(msg, "No message provided.");

		// User is requesting am entry
		if( msg.get ) {
			if ( this.memory[msg.get] ) {
				msg.topic = msg.get;
				this.success( msg, this.memory[msg.get] );
			} else {
				msg.topic = msg.get;
				this.success( msg, undefined );
			}

		// User want a dump of current cache
		} else if ( msg.dump === true ) {

			this.success( msg, this.memory );

		// User want to store an entry
		} else {
			if( msg.topic === undefined ) {
				return this.error(msg, "No topic provided.");
			}
			this.memory[msg.topic] = msg.payload;
		}

	}

}

module.exports = Cache;