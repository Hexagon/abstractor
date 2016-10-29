---
title: HTTP-Server
position: 13
---

Simple HTTP server, triggers both "request" and "/requested/url" on 
incoming requests.

Example: 

Listen on all requests
```javascript
httpNode.on("request", handlerNode);	// Receive message, pass to handler
handlerNode.on("success", httpNode);	// Handle message, pass back
```

Listen on request to /api/enable/lamp
```javascript
httpNode.on("/api/enable/lamp", handlerNode);
```

Listen on requests to /api/<wildcard>/on
```javascript
httpNode.on("/api/:device/on", handlerNode);
```

In this case, handlerNode need to be a generic function that takes an extra 
parameter (the wildcard).
```javascript
requestHandler = flow( "generic", function(msg, device) { 
    msg.payload = 'turning on ' + device;
    return msg;  
});
```

The server responds to a request when it gets the message back. See first
example above.