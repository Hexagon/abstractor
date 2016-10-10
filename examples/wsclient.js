var
    // Initialize abstractor
    flow =      require("../lib")({ logLevel: 5 }),

    wsClientNode    = flow( "ws-client", { url: "ws://localhost:5050" } );

// wsClientNode.on("message", doSomething);