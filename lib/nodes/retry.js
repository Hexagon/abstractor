/***********************************************************************************

    Abstractor | Retry module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Resets process exit code and passes message.
    
    ----------------------------------------------------------------------------


***********************************************************************************/

"use strict";

const   Pipe = require("../pipe.js");

class Retry extends Pipe {

   constructor(parameters) {

        var defaults = {
            retries: 5
        };

        super(parameters, defaults);

    }

    invoke(msg) {
        if(--this.config.retries > 0) {
            process.exitCode = 0;
            this.success( msg );
        } else {
            this.error( msg );
        }
    }

}

module.exports = Retry;