var 
	// Initialize abstractor
	$ = require('../lib')({ debug: true });

	// Create nodes
	cronNode = $( "cron", { pattern: '5,10,15,20,25,30,35,40,45,50,55 * * * * *', options: { maxRuns: 5 }});
	heartbeatNode = $( "heartbeat", { timeout: 7000 });
	killNode = $( "kill" );

// Cron node emits a message every fifth second
cronNode.on("success", heartbeatNode);
	// Heartbeat node expects a message every seventh second, if the messages stop arriving, kill the process
	heartbeatNode.on("timeout", killNode);