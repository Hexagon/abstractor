var 
	// Initialize abstractor
	flow = require('../lib')({ debug: true });

	// Create nodes
	httpNode = flow("http-client"),
	htmlNode = flow("html", { get: 'object', selector: 'a' } ),
	debugNode = flow("generic", function (msg) { console.log(msg); });

// Get all links on page as objects
httpNode.on("response", htmlNode);
	htmlNode.on("success", debugNode);

// Manually invoke flow
httpNode.invoke({ topic: "http://frekvenslista.com" });
