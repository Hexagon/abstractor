/***********************************************************************************

    Abstractor | Split module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Splits an incoming array and emits one separate "item" message per item.

    If messages are redirected back into this module after they are processed,
    the module keeps track of when all messages are processed, and emit an
    "success" event.


    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
                                   |  first               |  payload
                                   |  item                |  payload
                                   |  success             |  payload
    payload: <array>               +----------------------+---------------------
                                   |  error               |  error
    -------------------------------+----------------------+---------------------


***********************************************************************************/
"use strict";

const
    Pipe = require("../pipe.js"),
    extend = require("util")._extend;

class Split extends Pipe {
    
    invoke(msg) {

        var self = this; 

        // Has the message been here before?
        if ( this.traceback( msg ) ) {

            // Check if we have got callbacks on all batches
            if (--this.items == 0) { this.trigger( "success", this.originalMsg ); }

        // No message, split payload into batches and trigger "batch" for each chunk
        } else {

            // Keep track of triggered batches
            this.items = 0;

            if ( msg.payload && msg.payload.slice ) {
                for (var i=0; i<msg.payload.length; i++) {
                    let msgCopy = extend({}, msg);
                    msgCopy.payload = msgCopy.payload.slice(i,i+1)[0];
                    if(i===0) this.trigger( "first", this.originalMsg );
                    this.items++;
                    setImmediate(function() { self.trigger( "item", msgCopy); } );
                }
            } else {
                this.error( msg, "message.payload has to be an array!");
            }
        }
    }
}

module.exports = Split;
