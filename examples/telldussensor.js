var 
	// Initialize abstractor
	flow = require('../core')( { debug: true }),

	// Create nodes
	telldusSensorNode = $("telldus-sensor"),
	httpNode = flow( "http-server", { port: 8087 }),
	cacheNode = flow( "cache" );
	dumpCacheNode	= flow( "generic", function (msg) { return extend(msg, { dump: true }); } ),

	// Utilities;
	extend = 	require("util")._extend;

// HTTP /fullcache -> get all cache entries -> response
httpNode.on("/cache/dump", dumpCacheNode);
	dumpCacheNode.on("success", cacheNode);
		cacheNode.on("success", httpNode);

// Connect nodes
telldusSensorNode.on("received", cacheNode);
