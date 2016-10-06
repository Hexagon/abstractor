"use strict";

var 
    // Initialize abstractor, we don't want any type of debug output
    // Hence silent: true
    f = require("../lib")({ silent: true }),

    // Create nodes
    // - Set up http client, url is passed as message topic, but could be passed here as on option (url: 'htt...')
    http =  f( "http-client" /*,  { url: "http://myurl"} ^*/),

    // - Parse html document, extract all links
    html =  f( "html", { get: "array", selector: "a" } ),

    // - Split result array into individual messages
    split = f( "split" ),

    // - Output href (if such exist) to console
    debug = f( "generic", (msg) => { console.log(msg.payload.attribs.href); } );

// Create flow
http.on("response", html);
html.on("success", split);
split.on("item", debug);

// Manually invoke flow
http.invoke({ topic: "http://en.wikipedia.org" });
