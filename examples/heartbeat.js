var 
    // Initialize abstractor
    $ = require("../lib")(),

    // Create nodes
    cronNode = $( "cron", { pattern: "*/2 * * * * *", maxRuns: 5 }),
    heartbeatNode = $( "heartbeat", { timeout: 7000 }),
    killNode = $( "kill" );

// Cron node emits a message every fifth second
cronNode.on("success", heartbeatNode);

    // Heartbeat node expects a message every seventh second, if the messages stop arriving, kill the process
    heartbeatNode.on("timeout", killNode);