var
	// Initialize abstractor
	flow = 		require('../lib')();

// Set up node instances
debugNodeSuccess 	= flow( "debug", { member: 'payload', raw: true });
httpNode 			= flow( "http-client" );

// Cron test flow
httpNode.invoke({ 
	topic: "http://www.google.com",
	headers: { 'User-Agent': 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+'} 
});
	httpNode.on("response", debugNodeSuccess);			// Every 15 seconds, inject a message to the flow
