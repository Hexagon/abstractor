
# Abstractor

[![Build status](https://travis-ci.org/Hexagon/abstractor.svg)](https://travis-ci.org/Hexagon/abstractor) [![npm version](https://badge.fury.io/js/abstractor.svg)](https://badge.fury.io/js/abstractor)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io/badge/license-MIT-blue.svg)

Node.js abstraction layer and automation framework.

Note that this is a fully working library, but it is work in progress. Expect compatibility breaks even between minor version bumps.



# Installation

## From npm

```npm install abstractor```

## Dependencies

Abstractor itself has very few dependencies. However, certain embedded modules dynamically includes third party libraries. As an example, The telldus modules need http://github.com/hexagon/telldus to work.

The framework will raise an run time error if it is missing an dependency.



# Examples 

## Continuously tail a file
```javascript
var

	// Initialize abstractor
	factory = require('abstractor')(),

	// Create nodes
	watchNode = 	factory( "file-watch", { path: '/var/log/syslog' }),
	readNode = 		factory( "file-read", { tail: 5 }),
	outputNode = 	factory( "generic", function (msg) { console.log(msg.payload); });

// Connect WatchNode -> ReadNode -> OutputNode
watchNode.on("success", readNode);
	readNode.on("success", outputNode);
```

## Debugging

### Basic

Basic debugging outputs a timestamped log everytime a node is invoked or triggers a message.

```javascript
var

	// Initialize abstractor
	factory = require('abstractor')({debug: true}),

// ...
```

### Verbose

Verbose debugging adds the actual message to each log entry.

```javascript
var

	// Initialize abstractor
	factory = require('abstractor')({debug: true, verbose: true}),

// ...
```


For more; see examples/ folder. 



# Built in nodes

### Message Cache

In memory key/value storage, great for storing the last payload
of a specific topic.
    
### Cron scheduler

Competent cron-like scheduler based on croner (github.com/hexagon/croner)

### CSV Generator/Parser

CSV parser and generator. Parser uses fast-csv.

If input payload is an array width objects, the contained objects are
converted to CSV rows.

If input payload is a string, the string is parsed to an array of objects.

### Delay

Waits for x milliseconds before passing the message.

### Exec

Executes a command, returns exit code, stdout and stderr.

### File-Read

Reads a file, capable of reading first/last x rows and first/last x 
characters.
    
### File-Watch

Watches a file for changes, emits a message on change.
    
### File-Write

Writes payload (string/buffer) to a file, encoding and flag are configurable.

Possible flags:
   a  = append
   w  = overwrite

### Generic node factory

Converts a regular function to a abstractor node.

### Heartbeat

Monitors the frequency of messages received, outputs "timeout" when no 
message has arrived in x ms.
    
### HTML Parser

Parses the payload HTML and outputs an object representing the html.

The get-parameter can contain any of these: 
  object    - Object representation of the selected element
  attribute - Gets the value of a specific attribute 
	      (specified by attribute option)
  value     - Value of certain nodes (input, textarea select)
  text      - Text contained in selected element
  html      - ?
  array     - Array of objects representing matched elements

### HTTP Client

Gets the response code, body and response headers from an url.
Does follow redirects.

### HTTP Server

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

### JSON Generator/Stringifier

JSON parser and stringifier. When feeded with an object, payload is 
stringified to JSON and vice versa.

### Process killer

Kills the current process when receiving a message. Exit code is configurable
through node config (exitCode), or through message property (also exitCode).

### Mail sender

Sends mail using nodemailer. Options are passed as is, see: 

https://github.com/nodemailer/nodemailer#set-up-smtp

### Key-Value mapper

Replaces the values of configured column in a dataset with another value.

The first time the node is invoked, it expects a map (key-valye object or
array of key->value arrays) to be passed as message.payload.

### MQTT Client

Subscribe to topics, and send messages to a MQTT network. Supports 
setting/getting qos and retain flag.

### MSSQL Client

No less, no more.

### MySQL Client

No less, no more.

### Array splitter

Splits an incoming array and emits one separate "item" message per item.

If messages are redirected back into this module after they are processed,
the module keeps track of when all messages are processed, and emit an
"success" event.

### Message stripper

Removed unwanted properties before apssing the message firther.

### Telldus device controller

Listens for status changes, and sets status of a configured telldus device.

### Telldus sensor reader

Listens for sensor updates in telldus network.


# License

MIT
