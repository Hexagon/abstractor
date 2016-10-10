"use strict";

var
    path = require("path"),

    // Initialize abstractor
    flow =      require("../lib")(),

    // Set up node instances
    httpServer = flow( "http-server", { port: 8083 } ),
    fileReadNode = flow( "file-read" ),

    // Request a file from disk
    httpRequestNode = flow( "generic", function (msg) {

        let wwwRoot = 'c:/lol',

            // Prevent directory traversal
            safeUrl = path.normalize(msg.req.url).replace(/^(\.\.[\/\\])+/, ''),
            safePath = path.join(wwwRoot, safeUrl);

        // Add path to message
        msg.path = safePath;

        return msg;

    }),

    // Handle file not found
    httpErrorNode = flow( "generic", function (msg) {
        msg.responseCode = 404;
        msg.error = "404, not found.";
        return msg;
    }),

    // Generate a random number
    rngNode = flow( "generic", function (msg) {
        msg.payload = Math.round(Math.random()*1000000);
        return msg;
    });

// Serve dynamic assett /api/random
httpServer.on("/api/random", rngNode);
    rngNode.on("success", httpServer);

// Fall back to serving files from disk
httpServer.on("request", httpRequestNode);
    httpRequestNode.on("success", fileReadNode);
        // File existed and could be read, pass response to httpServer
        fileReadNode.on("success", httpServer);
        // Error occurred while reading file, create a error page and pass back to server
        fileReadNode.on("error", httpErrorNode);
            httpErrorNode.on("success", httpServer);