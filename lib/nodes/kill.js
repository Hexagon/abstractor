/***********************************************************************************

    Abstractor | Killer module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Kills the current process when receiving a message. Exit code is configurable
    through node config (exitCode), or through message property (also exitCode).

    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    exitCode         |  number         |  0                   |  no
    ----------------------------------------------------------------------------


***********************************************************************************/

"use strict";

const
    Node = require("../node.js");

class Kill extends Node {

    constructor(parameters) {
        
        var defaults = {
            exitCode: 0
        };

        super(parameters, defaults);

    }

    invoke(msg) {

        var exitCode = this.getConfig("exitCode", msg, true);

        process.exit(exitCode);

    }

}

module.exports = Kill;