/***********************************************************************************

    Abstractor | Junction | MIT License | ©2016 Hexagon <github.com/hexagon>

    Emits messages with incoming topic as event name.

    { 
        topic: "hellu", 
        payload: <data>
    }

    Will be passed with

    junctionNode.on( "hellu", <receiver> );

***********************************************************************************/

"use strict";

const
    Node = require("../node.js");

class Junction extends Node {

    constructor(parameters) {
        
        var defaults = { };

        super( parameters, defaults );

    }

    invoke(msg) {

        if ( Object.prototype.toString.call( msg.topic ) === "[object String]" ) {
            this.trigger( msg.topic , msg );
        } else {
            this.error( msg, "Junction got message with invalid topic. Topic need to be string." );
        }

    }

}

module.exports = Junction;