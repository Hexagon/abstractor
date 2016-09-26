var 
	// Initialize abstractor
	flow = require('../lib')({ debug: true, verbose: false }),

	// Create nodes
	httpNode = flow( "http-server", { port: 8087 }),
	fileNode = flow( "file-read" ),

	// Application settings
	wwwRoot = "/var/www/test/",					// <- including tailing slash

	// Request handler from generic 
	requestHandler = flow( "generic", (msg, uri) => { msg.path = wwwRoot + uri; return msg;  });

// HTTP /fullcache -> get all cache entries -> response
httpNode.on("/test/:file", requestHandler);
	requestHandler.on("success", fileNode);
		fileNode.on("success", httpNode);
		fileNode.on("error", httpNode);
