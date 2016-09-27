// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const
	Pipe = require("../pipe.js"),
	telldus = require("telldus");

class TelldusSensor extends Pipe {
	
	constructor(parameters) {
		super(parameters);

		// ToDo: Define self in base class instead of every single node
		var self = this;
			
		telldus.addSensorEventListener(function(deviceId,protocol,model,type,value,timestamp) {
			self.trigger( "received" , { topic: deviceId, payload: {deviceId,protocol,model,type,value,timestamp} });
		});

	}
	
}

module.exports = TelldusSensor;