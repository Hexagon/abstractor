var 
    // Initialize abstractor
    flow = require("../lib")({ debug: true, verbose: true }),

    // Create nodes
    jsonNode1 = flow( "json", {} ),
    jsonNode2 = flow( "json", {} ),
    fileWriteNode = flow( "file-write", { path: "./test.json", flag: "w"} ),
    fileReadNode = flow( "file-read" );


// Create json string, save it to file
jsonNode1.on("success", fileWriteNode);

// When saved, read it back in
fileWriteNode.on("success", fileReadNode);

// And parse back to object
fileReadNode.on("success", jsonNode2);

// Go!
jsonNode1.start( {
    payload: {
        hellu: "lol",
        lol: "lal",
        lil: 1
    }
});