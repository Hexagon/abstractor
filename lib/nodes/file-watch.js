/***********************************************************************************

    Abstractor | File watcher | MIT License | ©2016 Hexagon <github.com/hexagon>

    Watches a file for changes, emits a message on change.

    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    path             |  string         |  undefined           |  yes
    -----------------+-----------------+----------------------+-----------------


    I/O

    -------------------------------+----------------------+---------------------
    Input                          |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
                                   |  success             |  path
    N/A                            +----------------------+---------------------
                                   |  error               |  path
                                   |                      |  error
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const
    Pipe = require("../pipe.js"),
    fs = require("fs");

class FileWatch extends Pipe {

    constructor(parameters) {

        super(parameters);

        var 
            self = this,

            msg = {},

            // Mandatory options
            filePath = this.getConfig("path", msg, true);

        // File path is mandatory, bail out if not found
        if (filePath === undefined)
            // getConfig has already emitted an error about this
            return;

        // Supply file path to next node
        msg.path = filePath;

        fs.watch(filePath, (eventType) => {
            if ( eventType == "change" ) {
                self.success(msg, msg.payload);
            }
        });

    }

}

module.exports = FileWatch;