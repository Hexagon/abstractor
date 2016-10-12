---
title: Example
position: 4
---

To put it all together, an example that continously tail a file on changes and output the last 10 rows to the console.

  ~~~ javascript
  var

      // Initialize abstractor
      abstractor = require("abstractor"),
    
      // Create node factory
      factory = abstractor()

      // Create nodes
      
      // - Create instance of file-watch node, tell the node to monitor `/var/log/syslog`
      //   This node will emit "success" every time the file changes
      watchNode =   factory( "file-watch", { path: '/var/log/syslog' }),
      
      // - Create a file-read node, tell it to only read the last 10 rows.
      //   On completion, "success" will be emitted.
      readNode =    factory( "file-read", { tail: 10 }),
      
      // - In this example, we create a generic node (function wrapper) that just print the payload
      //   to the console.
      outputNode =  factory( "generic", function (msg) { console.log(msg.payload); });

  // Ok, the building blocks is ready, we just got to stack them up.
  watchNode.on("success", readNode);
  readNode.on("success", outputNode);
  ~~~