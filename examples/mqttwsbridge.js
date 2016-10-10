var
    // Initialize abstractor
    flow =      require("../lib")(),

    wsServerNode    = flow( "ws-server", { port: 5050 } ),

    // ws server passes content of payload to clients, so we have to place a autmented message inside payload
    cleanUpNode 	= flow( "generic", function (msg) { return { payload: { topic: msg.topic, payload: msg.payload }}});

    mqttNode    	= flow( "mqtt", { topic: "+/+/+/+", host: "192.168.0.4", port: 8883 } );

// MQTT -> WebSockets
mqttNode.on("message", cleanUpNode);
	cleanUpNode.on("success", wsServerNode);