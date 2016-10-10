var 

    // Initialize abstractor
    flow = require("../lib")({logLevel: 3}),

    // Create nodes
    // - Splits message.payload, emits each array item as a separate message
    split =         flow("split"),

    // - Enqueues messages and emits them synchronously, FIFO
    queue =         flow("queue"),

    // - Applies a random delay to test synchronousness
    randomDelay =   flow("generic", function (msg, success) { 
        setTimeout(function() { success(msg); }, Math.random()*200); 
    }),

    // - Print a message when the queue is started
    debugStarted = flow("generic", function (msg) { 
        this.log.log("STARTED", "Queue started!"); 
        return msg; 
    });

    // - Prints the received payload
    debug =     flow("generic", function (msg) { 
        this.log.log("ITEM", msg.payload); 
        return msg; 
    }),

    // - Print a message when the queue is done
    debugDone = flow("generic", function (msg) { 
        this.log.log("DONE", "All done!"); 
        return msg; 
    });

// Create flow
split.on("item", queue);                    // Send each item to queue
    queue.on("started", debugStarted);      // Before the queue starts emitting items,  print a message
    queue.on("item", randomDelay);          // When queue emits a new message, wait random ms before passing
        randomDelay.on("success", debug);   // When delay has passed, print message.payload
            debug.on("always", queue);      // ALWAYS pass message back to queue, this is the callback
    queue.on("drained", debugDone)          // When the queue is drained, print a message

// Put numbers 1-30 in queue using the split module
split.start( {payload: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] } );

// Append 31-35 directly ont queue
queue.start( {payload: 31 } );
queue.start( {payload: 32 } );
queue.start( {payload: 33 } );
queue.start( {payload: 34 } );
queue.start( {payload: 35 } );