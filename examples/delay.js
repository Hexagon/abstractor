var 
	// Initialize abstractor
	$ = require('../lib')({ debug: true });

	// Create nodes
	cronerMsgNode1 = $( "cron", { "pattern": "0,27 * * * * *", "message": { "payload": "Message 1"} } ),
	cronerMsgNode2 = $( "cron", { "pattern": "5,25 * * * * *", "message": { "payload": "Message 2"} } ),
	cronerAbortNode = $( "cron", { "pattern": "7 * * * * *", "message": { "abort": true} } ),

	delayNode = $( "delay", { delay: 10000 });

cronerMsgNode1.on( "success", delayNode);
cronerMsgNode2.on( "success", delayNode);
cronerAbortNode.on( "success", delayNode);