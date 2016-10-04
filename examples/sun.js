var 
    // Initialize abstractor
    flow = require("../lib")({ debug: true }),

    // Create nodes
    sunNode = flow( "sun", { latitude: 62.43, longitude: 17.38 }),
    eventNode = flow("generic", function (msg) {  console.log("Event occurred:", msg); });

// Call eventNode every time the sun sets
sunNode.on("sunset", eventNode);