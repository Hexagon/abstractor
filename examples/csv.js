var 
    // Initialize abstractor
    flow = require("../lib")(),

    // Create nodes
    csvNode1 = flow( "csv", {} ),
    csvNode2 = flow( "csv", { headers: false} ),
    fileWriteNode = flow( "file-write", { path: "./test.csv", flag: "w"} ),
    fileReadNode = flow( "file-read" );


// Create json string, save it to file
csvNode1.on("success", fileWriteNode);

// When saved, read it back in
fileWriteNode.on("success", fileReadNode);

// And parse back to object
fileReadNode.on("success", csvNode2);

// Go!
csvNode1.start( {
    payload: ["lol\"","lal\r\nas\nd",123,"\"\"lol\"\""]
});