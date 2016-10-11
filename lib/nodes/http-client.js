/***********************************************************************************

    Abstractor | HTTP Client | MIT License | ©2016 Hexagon <github.com/hexagon>

    Gets the response code, body and response headers from an url.
    Does follow redirects.

    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    method           |  string         |  "GET"               |  yes
    url              |  string         |  undefined           |  no
    data             |  object         |  undefined           |  no
    -----------------+-----------------+----------------------+-----------------


    I/O

    -------------------------------+----------------------+---------------------
    Input                          |  Possible triggers   |  Sets parameter
    -------------------------------+----------------------+---------------------
                                   |                      |  payload
                                   |  success             |  redirects
    GET:  <any message>            |                      |  response
    POST: payload: <object>        |                      |  statusCode
                                   +----------------------+---------------------
                                   |  error               |  error
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const
    Node = require("../node.js"),
    http = require("http"),
    https = require("https"),
    url = require("url");

class HTTP extends Node {

    constructor(parameters) {
        
        var defaults = {
            timeout: 600000,
            headers: {},
            method: "GET"
        };

        super(parameters, defaults);

    }
    invoke(msg) {
        
        var self = this,

            // Mandatory options
            method = this.getConfig("method", msg, true),

            // Optinal options, defaults are append, read/write permissions to all and utf8 encoding
            headers = this.getConfig("headers", msg, true),
            requestedUrl = this.getConfig("url", msg, false) || msg.topic,
            data = this.getConfig("data", msg, false),

            // Derived options
            host,
            port,
            path,
            handler,
            options;

        // Set up method, overridable by msg.method
        if ( msg.method ) {
            if( msg.method === "GET" || msg.method == "POST" ) {
                method = msg.method;
            } else {
                return this.error(msg, "Unsupported method requested: " + msg.method + ". Supported options is GET or POST.");
            }
        }

        // Parse url
        if ( requestedUrl ) {
            let parsedUrl = url.parse( requestedUrl );

            // Check for supported protocol
            if ( ! ( parsedUrl.protocol == "http:" || parsedUrl.protocol == "https:" ) )  {
                this.error(msg, "Unsupported protocol in URL, available protocols are http and https.");
                return;
            } else {
                handler = (parsedUrl.protocol == "http:") ? http : https;
            }

            // 
            host = parsedUrl.hostname;
            port = parsedUrl.port ? parsedUrl.port : (parsedUrl.protocol == "http:" ? 80 : 443);
            path = parsedUrl.path;

        } else {
            msg.error = "No URL provided, config.url or msg.topic need to contain an URL.";
            this.trigger("error", msg);
            return;
        }

        // In case of post, check that data is stringifiable, or undefined
        if ( method == "POST") {
            data = data || msg.payload;
            if ( data === undefined ) {
                data = "";
            } else if ( msg.payload.toString ) {
                data = msg.payload.toString();
            } else {
                return this.error( msg , "Invalid POST data provided to msg.payload or config.data, must be string or stringifiable.");
            }
        }

        // If headers is supplied in msg.headers, they need to be an object
        if ( msg.headers && typeof msg.headers !== "object" ) {
            return this.error(msg, "Invalid headers provided, msg.headers must be an javascript object with key/value pairs.");
        } else if ( msg.headers ) {
            headers = msg.headers;
        } 

        // All should be ok by now
        options = { host, path, port, method, headers };

        // Set up request
        var req = handler.request(options, function(response) {
            let data = [];
            response.on("data", (chunk) => { data.push(chunk); });
            response.on("end", () => { 
        
                // Follow redirect?
                if ( response.statusCode == 301 || response.statusCode == 302 ) {
                    if ( msg.redirects === undefined ) {
                        msg.redirects = 0;
                    }
                    msg.redirects++;
                    if ( msg.redirects > 5 ) {
                        // Uh oh, we seem to be stuck in a redirect loop
                        return this.error(msg, "HTTP Request got stuck in a redirect loop (>5 redirects), bailing out.");
                    } else {
                        // All good, follow redirect!
                        msg.topic = response.headers.location;
                        self.invoke(msg);
                        return;
                    }

                // Ok, next!
                } else {
                    msg.response = response.headers;
                    msg.statusCode = response.statusCode;
                    msg.payload = data.join(""); 
                    self.trigger("response", msg); 
                }

            });
        });
        req.on("error", (e) => { self.error(msg, e); });

        // Write data in case of POST
        if ( method == "POST" ) {
            req.write( msg.payload.toString() );
        }

        // Finalize
        req.end();
    }

}

module.exports = HTTP;
