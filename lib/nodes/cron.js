/***********************************************************************************

    Abstractor | Cron module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Competent cron-like scheduler based on croner (github.com/hexagon/croner)

    ----------------------------------------------------------------------------


    Dependencies

    croner


    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    pattern          |  string         |  "* * * * * *"       |  yes
    maxRuns          |  number         |  undefined           |  no
    startAt          |  date object    |  undefined           |  no
    stopAt           |  date object    |  undefined           |  no
    message          |  object         |  {}                  |  no
    -----------------+-----------------+----------------------+-----------------


    I/O

    -----------------------------+----------------------+-----------------------
    Input                        |  Triggers            |  Output
    -----------------------------+----------------------+-----------------------
    N/A                          |  success             |  <configured messge>
    -----------------------------+----------------------+-----------------------


***********************************************************************************/

"use strict";

const
    Node = require("../node.js"),
    Croner = require("croner");

class Cron extends Node {

    constructor(parameters) {
        
        var defaults = {
            pattern: "* * * * * *",
            maxRuns: undefined,
            startAt: undefined,
            stopAt: undefined,
            message: {}
        };

        super(parameters, defaults);

        var self = this;
        Croner(
            this.config.pattern, 
            {
                maxRuns: this.config.maxRuns,
                startAt: this.config.startAt,
                stopAt: this.config.stopAt

            }, function () {
                self.trigger("success", self.config.message);
            }
        );
        
    }

}

module.exports = Cron;