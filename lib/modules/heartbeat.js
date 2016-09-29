/***********************************************************************************

    Abstractor | Heartbeat monitor | MIT L. | ©2016 Hexagon <github.com/hexagon>

    Monitors the frequency of messages received, outputs "timeout" when no 
    message has arrived in x ms.

    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    timeout          |  number         |  60 000              |  yes
    -----------------+-----------------+----------------------+-----------------


    I/O

    -------------------------------+----------------------+---------------------
    Input                          |  Possible triggers   |  Output
    -------------------------------+----------------------+---------------------
    <any message>                  |  timeout             |  <last recv msg>
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const	Pipe = require("../pipe.js");

class Heartbeat extends Pipe {

	constructor(parameters) {
		
		var defaults = {
			timeout: 600000
		};

		super(parameters, defaults);

		this.lastGood = undefined;

		this.reset();

	}

	timeout() {
		this.trigger( "timeout", this.lastGood );
	}

	reset() {
		let self = this;

		if (this.timer) clearTimeout(this.timer);

		this.timer = setTimeout(
			function () { 
				self.timeout();
			}, 
			this.config.timeout 
		);

	}

	invoke(msg) {
		this.reset();
		this.lastGood = msg;
	}

}

module.exports = Heartbeat;