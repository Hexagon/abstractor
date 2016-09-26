var 
	// Initialize abstractor
	flow = require('../lib')({ debug: true});

	// Create nodes
	batchNode = flow("split");
	syncNode = flow("generic", function (msg) { return msg; }),
	asyncNode = flow("generic", function (msg, success, error) { setTimeout(function () { success(msg); },2000); }),
	debugNodeDone = flow("generic", function (msg) {  console.log('Done', msg); });
	debugNodeAsync = flow("generic", function (msg) {  console.log('Async', msg); });

// Connect nodes
batchNode.on("item", syncNode);
	syncNode.on("success", asyncNode);

		// Debug done batch
		asyncNode.on("success", debugNodeAsync);

		// ALL code-paths need to point back to base batch object, for .on("success") to work
		asyncNode.on("success", batchNode);
		asyncNode.on("error", batchNode);

batchNode.on("success", debugNodeDone);

batchNode.start({payload: [1,2,3,4,5,6,7,8,9,101,1,1,23,12,3,12,3,12,3,11,12]});