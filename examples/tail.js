var
    // Initialize abstractor
    flow = require("../lib")({ logLevel: 5 }),

    filePath = "/var/log/syslog",

    // Create nodes
    watchNode = flow( "file-watch", { path: filePath }),
    readNode = flow( "file-read", { tail: 5 }),
    outputNode = flow( "generic", function (msg) { console.log(msg.payload); });

// HTTP /fullcache -> get all cache entries -> response
watchNode.on("success", readNode);
    readNode.on("success", outputNode);