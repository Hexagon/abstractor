/***********************************************************************************

    Abstractor | MQTT module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Subscribe to topics, and send messages to a MQTT network. Supports 
    setting/getting qos and retain flag.


    ----------------------------------------------------------------------------


    Dependencies

    mqtt


    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    host             |  string         |  undefined           |  yes
    port             |  integer        |  undefined           |  yes
    topic            |  string         |  undefined           |  yes
    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
    N/A                            |  message             |  topic
                                   |                      |  payload
                                   |                      |  qos
                                   |                      |  retain
                                   +----------------------+---------------------
                                   |  error               |  error
    -------------------------------+----------------------+---------------------
                                   |  success             |  <none>
    topic: <str>, payload: <str>   +----------------------+---------------------
                                   |  error               |  <none>
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const 
    Node = require("../node.js"),
    mqtt = require("mqtt");

class MQTT extends Node {
    
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

        if ( msg && msg.topic !== undefined && msg.payload !== undefined) {
            this.client.publish(msg.topic, msg.payload, { qos: msg.qos || 0, retain: msg.retain || false});
            this.success( msg, msg.payload );
        } else {
            this.error( msg, "Message missing topic and/or payload.");
        }

    }

}

module.exports = MQTT;