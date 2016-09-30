var 
	// Initialize abstractor
	flow = require('../lib')(),

	// Create nodes
	httpNode = flow( "http-server", { port: 8087 }),
	fileNode = flow( "file-read" ),

	// Application settings
	wwwRoot = "c:/",					// <- including tailing slash

	// Request handler from generic 
	requestHandler = flow( "generic", (msg, uri) => { msg.path = wwwRoot + uri; return msg;  });

// HTTP /fullcache -> get all cache entries -> response
httpNode.on("/test/:file", requestHandler);
	requestHandler.on("success", fileNode);
		fileNode.on("success", httpNode);
		fileNode.on("error", httpNode);
