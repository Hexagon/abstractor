/***********************************************************************************

    Abstractor | Telldus Senors | MIT License | ©2016 Hexagon <github.com/hexagon>

    Listens for sensor updates in telldus network.


    ----------------------------------------------------------------------------


    Dependencies

    node-telldus


    ----------------------------------------------------------------------------


    Options

    None.


    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Output
    -------------------------------+----------------------+---------------------
    N/A                            |  received            |  topic
                                   |                      |  payload
    -------------------------------+----------------------+---------------------

***********************************************************************************/

"use strict";

const
    Node = require("../node.js"),
    telldus = require("telldus");

class TelldusSensor extends Node {
    
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