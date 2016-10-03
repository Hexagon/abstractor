/***********************************************************************************

    Abstractor | Websocket Server | MIT License | ©2016 Hexagon <github.com/hexagon>

    Simple WS server.
    

    ----------------------------------------------------------------------------


    Dependencies

    ws


    ----------------------------------------------------------------------------

    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    port             |  number         |  5051                |  yes
    mask             |  boolean        |  false               |  no
    binary           |  boolean        |  false               |  no
    -----------------+-----------------+----------------------+-----------------


***********************************************************************************/

"use strict";

const
    Pipe = require("../pipe.js"),
    WebSocketServer = require("ws").Server;

class WSServer extends Pipe {

    constructor(parameters) {

        // Always run super, provide defaults as second argument if needed
        var defaults = {
                port: 5051,
                mask: false,
                binary: false
            },
            self;

        super(parameters, defaults);

        self = this; 

        // Create server
        this.server = new WebSocketServer({ port: this.config.port });
        this.server.on("connection", function connection(ws) {

            // Handle incoming message
            ws.on("message", function incoming(message) {
                self.trigger( "message", { payload: message });
            });

        });
    }

    invoke(msg) {

        var self = this,

            mask = this.getConfig("mask", msg, false),
            binary = this.getConfig("binary", msg, false);

        // Broadcast message
        this.server.clients.forEach( function each(client) {
            client.send( !binary ? JSON.stringify( msg.payload ) : msg.payload, { mask: mask, binary: binary } );    
        } );
    }

}

module.exports = WSServer;