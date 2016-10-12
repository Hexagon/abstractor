/***********************************************************************************

    Abstractor | Split module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Splits an incoming array and emits one separate "item" message per item.


    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
                                   |  item                |  payload
    payload: <array>               +----------------------+---------------------
                                   |  error               |  error
    -------------------------------+----------------------+---------------------


***********************************************************************************/
"use strict";

const
    Node = require("../node.js"),
    extend = require("util")._extend;

class Split extends Node {

    invoke(msg) {

        let self = this,
            targetArray = msg.payload;

        // Remove array from message to simplify copying later on
        msg.payload = undefined;

        // Only start if we got a valid array
        if ( targetArray && targetArray.forEach ) {
            targetArray.forEach(function(item) {

                // Create a replica of the incoming message
                let msgCopy = Object.assign({}, msg);

                // Assign this item as payload
                msgCopy.payload = item;

                // Trigger message
                self.trigger( "item", msgCopy );
                
            });

        // Payload != array
        } else {
            this.error( msg, "message.payload has to be an array!");
        }
    }
}

module.exports = Split;
