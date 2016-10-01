/***********************************************************************************

    Abstractor | Strip module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Removed unwanted properties before apssing the message firther.


    ----------------------------------------------------------------------------


    Options

    One of these has to be set.

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    member           |  string         |  undefined           |  one of these
    members          |  array <string> |  undefined           |  are mandatory
    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Output
    -------------------------------+----------------------+---------------------
    <any message>                  |  success             |  <stripped message>
    -------------------------------+----------------------+---------------------


***********************************************************************************/
"use strict";

const
    Pipe = require("../pipe.js");

class Strip extends Pipe {

    invoke(msg) {

        if (this.config.member) {
            msg[this.config.member] = undefined;
        }

        if (this.config.members) {
            this.config.members.forEach(function(member) {
                msg[member] = undefined;
            });
        }
        
        this.trigger("success", msg);

    }

}

module.exports = Strip;