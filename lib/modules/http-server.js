// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const	Pipe = require("../pipe.js"),
		http = require("http"),
		https = require("https");

class HTTP extends Pipe {

	constructor(parameters) {

		// Always run super, provide defaults as second argument if needed
		var defaults = {
			listenerTimeout: 0.01,
			requestTimeout: 15
		};
		super(parameters, defaults);

		// Yuuup!
		var srv = http.createServer( (req, res) => {

			var listenerFound = false;

			// Prioritize named requests
			this.trigger(req.url, { req, res }, function () { listenerFound = true; } );

			// Always trigger "request"
			this.trigger("request", { req, res }, function () { listenerFound = true; }  );
			
			// Add listener timeout if there isn"t any listeners handling the message
			setTimeout(
				function () {
					if ( !listenerFound ) {
						// Nothing replied to this message, send 404
						res.writeHead(404, {"Content-Type": "text/plain"});
						res.end("Not found.");	
					}
				},
				parseInt(this.config.listenerTimeout) * 1000
			);

			// Add request timeout if message isn"t replied to by another module in a timely manner
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
				responseCode = 200;
			} else if (msg.error) {
				responseText = "<html><h2>Internal server error</h2><hr><pre>"+msg.error+"</pre></html>";
				responseCode = 500;
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