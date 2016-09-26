// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const 	Pipe = require("../pipe.js"),
		mqtt = require('mqtt');

class MQTT extends Pipe {
	
	constructor(parameters) {
		super(parameters);

		let self = this;

		this.client = mqtt.connect({host: this.config.host, port: this.config.port});

		this.client.on("connect", function () {
		  self.config.topic && self.client.subscribe(self.config.topic);
		});
		 
		this.client.on("message", function (topic, msg, data) {
		  self.trigger("message", { topic, payload: msg.toString(), retain: data.retain, qos: data.qos });
		});

		this.client.on("error", function (error) {
			self.trigger("error", { error });
		});

	}

	invoke(msg) {

		if ( msg && msg.topic && msg.payload ) {
			this.client.publish(msg.topic, msg.payload, { qos: msg.qos || 0, retain: msg.retain || false});
		} else {
			this.error( msg, "Message missing topic and/or payload.");
		}

	}

}

module.exports = MQTT;