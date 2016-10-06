var 
    // Initialize abstractor
    flow = require("../lib")(),

    // Create nodes
    // - Splits message.payload, emits each array item as a separate message
    split = flow("split"),
    // - Enqueues messages and emits them synchronously, FIFO
    queue = flow("queue"),
    // - Applies a random delay to test synchronousness
    randomDelay = flow("generic", function (msg, success) { setTimeout(function() { success(msg); }, Math.random()*1000); }),
    // - Prints the received payload
    debugNode = flow("generic", function (msg) { console.log("Done: " + msg.payload); return msg; });

// Connect nodes
split.on("item", queue);                        // Send each item to queue
    queue.on("item", randomDelay);              // When queue emits a new message, wait random ms before passing
        randomDelay.on("success", debugNode);   // When delay has passed, print message.payload
            debugNode.on("always", queue);      // ALWAYS pass message back to queue, this is the callback

split.start( {payload: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21] } );