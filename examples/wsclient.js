var
    // Initialize abstractor
    flow =      require("../lib")({ debug: true, verbose: true }),

    wsClientNode    = flow( "ws-client", { url: "ws://localhost:5050" } );

// wsClientNode.on("message", doSomething);