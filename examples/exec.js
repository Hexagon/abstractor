var 
	// Initialize abstractor
	flow = require('../lib')({ debug: true, verbose: false }),

	// Create nodes
	httpNode = flow( "http-server", { port: 8087 }),
	requestHandler = flow( "generic", function (msg, url) { msg.topic = "ping " + url + " -c 4 -w 5"; return msg; } ),
	execNode = flow( "exec" );

// HTTP /fullcache -> get all cache entries -> response
httpNode.on("/ping/:parm1", requestHandler);
	requestHandler.on("success", execNode);
		execNode.on("success", httpNode);
		execNode.on("error", httpNode);
