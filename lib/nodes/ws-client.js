/***********************************************************************************

    Abstractor | Websocket Client | MIT License | ©2016 Hexagon <github.com/hexagon>

    Reconnecting websocket client.
    

    ----------------------------------------------------------------------------


    Dependencies

    ws


    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    url              |  string         |  ws://localhost:5051 |  yes
    reconnectInterval|  integer        |  5000                |  no
    mask             |  boolean        |  false               |  no
    binary           |  boolean        |  false               |  nos
    -----------------+-----------------+----------------------+-----------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
    N/A                            |  message             |  payload
                                   |                      |  binary
                                   |                      |  masked
    -------------------------------+----------------------+---------------------

***********************************************************************************/

"use strict";

const
    Node = require("../node.js"),
    WebSocket = require("ws");

class WSClient extends Node {

    constructor(parameters) {

        // Always run super, provide defaults as second argument if needed
        var defaults = {
                url: "ws://localhost:5051"
            },
            self;

        super(parameters, defaults);

        self = this; 

        // Create reconnecting client
        var connect = function(){
            self.ws = new WebSocket(self.config.url);
            self.ws.on("close", function() {
                setTimeout(connect, self.config.reconnectInterval);
            });
            self.ws.on("error", function () { /* Ignore */ });
            self.ws.on("message", function(data, flags) {
                self.trigger( "message", { payload: data, binary: flags.binary, masked: flags.masked });
            });
        };
        connect();

    }

    invoke(msg) {

        var self = this,

            mask = this.getConfig("mask", msg, false),
            binary = this.getConfig("binary", msg, false);

        self.ws.send(msg.payload, { binary: binary, mask: mask });
    }

}

module.exports = WSClient;