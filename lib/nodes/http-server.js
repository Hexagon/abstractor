/***********************************************************************************

    Abstractor | HTTP Server | MIT License | ©2016 Hexagon <github.com/hexagon>

    Simple HTTP server, triggers both "request" and "<requested url>" on 
    incoming requests.

    Example: 
    
      Listen on all requests
      
        httpNode.on("request", handlerNode);    // Receive message, pass to handler
        handlerNode.on("success", httpNode);    // Handle message, pass back

      Listen on request to /api/enable/lamp

        httpNode.on("/api/enable/lamp", handlerNode);
        ...

      Listen on requests to /api/<wildcard>/on

        httpNode.on("/api/:device/on", handlerNode);
        ...

        In this case, handlerNode need to be a generic function that takes an extra 
        parameter (the wildcard).

        requestHandler = flow( "generic", function(msg, device) { 
            msg.payload = 'turning on ' + device;
            return msg;  
        });

    The server responds to a request when it gets the message back. See first
    example above.

    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    host             |  string         |  "127.0.0.1"         |  yes
    port             |  number         |  8081                |  yes
    requestTimeout   |  number         |  15                  |  yes
    -----------------+-----------------+----------------------+-----------------


***********************************************************************************/

"use strict";

const
    Pipe = require("../pipe.js"),
    http = require("http");

class HTTP extends Pipe {

    constructor(parameters) {

        // Always run super, provide defaults as second argument if needed
        var defaults = {
            requestTimeout: 15,
            host: "127.0.0.1",
            port: 8081
        };
        super(parameters, defaults);

        // Yuuup!
        http.createServer( (req, res) => {

            var listenerFound = false;

            // Prioritize named requests
            listenerFound = this.trigger(req.url, { req, res } );

            // Always trigger "request"
            if (!listenerFound) listenerFound = this.trigger("request", { req, res } );
            
            // Add listener timeout if there isn"t any listeners handling the message

            if ( !listenerFound ) {
                // Nothing replied to this message, send 404
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.end("Not found.");  
            }

            // Add request timeout if message isn't replied to by another module in a timely manner
            setTimeout(
                function () {
                    if ( !res.headerSent ) {
                        // Nothing replied to this message, send 404
                        res.writeHead(408, {"Content-Type": "text/plain"});
                        res.end("Request timeout.");    
                    }
                },
                parseInt(this.config.requestTimeout) * 1000
            );

        }).listen(this.config.port, this.config.host );
    }

    invoke(msg) {

        // Check if we are expected to respond to a incoming request, and that we have not already responded
        if ( msg.res && !msg.res.headerSent ) {

            // If msg.payload isn"t set, use msg.error
            var responseText = "",
                responseCode = 200;
            if (msg.payload) {
                // Content type from msg?
                responseText = msg.payload;
                if(msg.responseCode) {
                    responseCode = msg.responseCode;    
                } else {
                    responseCode = 200;
                }
                
            } else if (msg.error && !msg.responseCode) {
                responseText = "<html><h2>Internal server error</h2><hr><pre>"+msg.error+"</pre></html>";
                responseCode = 500;

            } else if (msg.error && msg.responseCode) {
                responseText = msg.error;
                responseCode = msg.responseCode;

            }
            
            // objects are stringified and sent as application/json, strings and things that can be converted to strings are sent with text/play, everything else respons with 500
            if(typeof responseText == "object") {

                msg.res.writeHead(responseCode, {"Content-Type": "application/json"});
                msg.res.end( JSON.stringify(responseText)); 
            } else if (typeof responseText == "string") {
                msg.res.writeHead(responseCode, {"Content-Type": "text/html"});
                msg.res.end( responseText );    
            } else if (responseText && responseText.toString && typeof responseText != "function") {
                msg.res.writeHead(responseCode, {"Content-Type": "text/html"});
                msg.res.end( responseText.toString());
            } else if (responseText == undefined) {
                msg.res.writeHead(responseCode, {"Content-Type": "text/plain"});
                msg.res.end("");
            } else {
                // Not sure how to present a non object and non string that is not convertable toString. 500!
                msg.res.writeHead(responseCode, {"Content-Type": "text/plain"});
                msg.res.end("Internal server error.");
            }

        // What?
        } else {
            msg.error = "HTTP Server node received invalid message, should be a http response.";
            this.trigger ( "error", msg );
        }

    }

}

module.exports = HTTP;