/***********************************************************************************

	Abstractor | Cron module | MIT License | ©2016 Hexagon <github.com/hexagon>

	Delays message x milliseconds.

	----------------------------------------------------------------------------


	Dependencies

	None

	
    ----------------------------------------------------------------------------


	Options

	-----------------+-----------------+----------------------+-----------------
	Option           |  Type           |  Default             |  Mandatory
	-----------------+-----------------+----------------------+-----------------
	delay            |  number         |  1000                |  yes
	-----------------+-----------------+----------------------+-----------------



    ----------------------------------------------------------------------------


	I/O

	-------------------------------+----------------------+---------------------
	Input                          |  Possible triggers   |  Output
	-------------------------------+----------------------+---------------------
	abort: true                    |  aborted             |  <full message>
    -------------------------------+----------------------+---------------------
	<any message>                  |  success             |  <full message>
	-------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const	Pipe = require("../pipe.js");

class Delay extends Pipe {

	constructor(parameters) {
		
		var	defaults = {
			delay: 1000
		};

		super(parameters, defaults);

		this.activeTimeouts = [];
	}

	spliceItem(item) {
		let i = this.activeTimeouts.indexOf(item);
		if( i >= 0 ) {
			this.activeTimeouts.splice(i,1);
		}
	}

	invoke(msg) {

		var	self = this,
			delay = this.getConfig("delay", msg, false);

		// Abort current delay(s)
		if ( msg.abort == true ) {
			for(let i = this.activeTimeouts.length -1; i >= 0; i--) {
				let currentTimer = this.activeTimeouts[i];
				clearTimeout( currentTimer[0] );
				self.trigger( "aborted", currentTimer[1] );
				self.spliceItem(currentTimer);
			}

		// Enqueue new delay
		} else {
			let thisTimeout = [],
				timeoutId = setTimeout(
				function () {
					self.spliceItem(thisTimeout);
					self.success( msg, msg.payload );
				}, 
				delay 
			);
			thisTimeout.push(timeoutId);
			thisTimeout.push(msg);
			self.activeTimeouts.push(thisTimeout);
		}

	}

}

module.exports = Delay;