/***********************************************************************************

    Abstractor | Queue | MIT License | ©2016 Hexagon <github.com/hexagon>

    Synchronous message queue. 

    Passes next message by emitting "item" when the previous has
    returned. Emits "drained" whenever queue becomes empty.

    The default is to process the queue synchronously, is is however possible to 
    allow concurrency by increasing "concurrency" option above the default of 1.

    ----------------------------------------------------------------------------


    Options

    ---------------------+-----------------+----------------------+-----------------
    Option               |  Type           |  Default             |  Mandatory
    ---------------------+-----------------+----------------------+-----------------
    concurrency          |  integer        |  1                   |  no
    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
                                   |  item                |  payload
    payload: <array>               |  drained             |  <none>
                                   +----------------------+---------------------
                                   |  error               |  error
    -------------------------------+----------------------+---------------------


***********************************************************************************/
"use strict";

const
    Pipe = require("../pipe.js"),
    extend = require("util")._extend;

class Queue extends Pipe {

    constructor(parameters) {

        var defaults = {
            concurrency: 1
        };

        super(parameters, defaults);

        this.queue = [];
        this.concurrent = 0;

    }

    shift() {

        let self = this;

        // If there is work left to do, and not too many concurrent jobs
        // Start another
        if( this.queue.length > 0 && this.concurrent < this.config.concurrency ) {

            // Immediately indicate that a new job is about to run
            this.concurrent++;

            // ... and/but trigger the new job at the end of current event loop
            setImmediate(function() {
                self.trigger( "item" , self.queue.shift() );
            });

            // Indicate that we shifted a new job from the queue
            return true;

        } else {

            // Are the queue drained?
            if ( this.queue.length === 0 ) {
                self.trigger( "drained" , {} );
            }

            // Indicate that we couldn't shift a new job
            return false;

        }

    }

    push(msg) {

        // Push message onto queue
        this.queue.push(msg);

        // Shift any enqueued messages
        this.shift();

    }

    invoke(msg) {

        // Has the message been here before? If so, this call is a callback from a done job
        if ( this.traceback( msg ) ) {
            
            // Reduce concurrency counter
            this.concurrent--;

            // Start another job, if there is any
            this.shift();

        // Fresh message
        } else {

            // Put the job on queue
            this.push(msg);

        }
    }
}

module.exports = Queue;