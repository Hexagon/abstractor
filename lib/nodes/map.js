/***********************************************************************************

    Abstractor | Map module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Replaces the values of configured column in a dataset with another value.

    The first time the node is invoked, it expects a map (key-valye object or
    array of key->value arrays) to be passed as message.payload.


    ----------------------------------------------------------------------------

    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    column           |  integer        |  0                   |  yes
    ignoreMisses     |  boolean        |  false               |  no
    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
    payload: <map array/object>    |  ready               |  payload
    -------------------------------+----------------------+---------------------
    payload: <dataset array>x      |  success             |  payload
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const
    Node = require("../node.js");

class Map extends Node {

    invoke(msg) { 

        var self = this;
        if (this.memory === undefined) {
            
            // If msg.payload isn"t an array, it"s probably an object
            if( Object.prototype.toString.call( msg.payload[0] ) !== "[object Array]") {
                var key1 = Object.keys( msg.payload[0] )[0],
                    key2 = Object.keys( msg.payload[0] )[1];
                this.memory = [];
                msg.payload.forEach(function(row) {
                    self.memory.push([row[key1],row[key2]]);
                });
            } else {
                this.memory = msg.payload;  
            }
            this.trigger( "ready", {} );
            return;

        } else {
            var column = this.config.column || 0; // map to the first column of dataset as default
            var result = [];
            msg.payload.forEach(function(row) {
                var found = false;
                for(let i = 0; i < self.memory.length; i++) {
                    if( typeof row[column] == "string" && typeof self.memory[i][0] == "string") {
                        // Case insensitive check
                        if ( row[column].toLowerCase() == self.memory[i][0].toLowerCase()) {
                            found = true; row[column] = self.memory[i][1];
                        }
                    } else {
                        if ( row[column] == self.memory[i][0]) {
                            found = true; row[column] = self.memory[i][1];
                        }
                    }
                }
                if( found || !self.config.ignoreMisses) result.push(row);
            });
            msg.payload = result;
            self.trigger("success" , msg);
            
        }

    }
    
}

module.exports = Map;