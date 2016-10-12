var 

    // Initialize abstractor
    abstractor = require("../lib"),
    flow = abstractor({logLevel: 3}),

    // Create nodes
    // - Splits message.payload, emits each array item as a separate message
    split =         flow("split"),

    // - Enqueues messages and emits them synchronously, FIFO
    queue =         flow("queue"),

    // - Applies a random delay to test synchronousness
    randomDelay =   flow("generic", function (msg, success) { 
        setTimeout(function() { success(msg); }, Math.random()*200); 
    }),

    // - Prints the received payload
    debug =     flow("generic", function (msg) { 
        this.log.log("ITEM", msg.payload); 
        return msg; 
    });

// Create flow
// .on() return this so chaining is possible. Not very readable though
split.on("item",                                // Send each item to queue
    queue.on("started", "Queue started!")       // Before the queue starts emitting items,  print a message
         .on("item",                            // When queue emits a new message, wait random ms before passing
            randomDelay.on("success",           // When delay has passed, print message.payload
                debug.on("always", queue)))     // ALWAYS pass message back to queue, this is the callback
         .on("drained", "All done!"));          // When the queue is drained, print a message

// Put numbers 1-30 in queue using the split module
split.start( {payload: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] } );

// Append 31-35 directly ont queue
queue.start( {payload: 31 } );
queue.start( {payload: 32 } );
queue.start( {payload: 33 } );
queue.start( {payload: 34 } );
queue.start( {payload: 35 } );