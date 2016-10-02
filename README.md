
# Abstractor

[![Build status](https://travis-ci.org/Hexagon/abstractor.svg)](https://travis-ci.org/Hexagon/abstractor) [![npm version](https://badge.fury.io/js/abstractor.svg)](https://badge.fury.io/js/abstractor)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io/badge/license-MIT-blue.svg)

Node.js abstraction layer and automation framework.

# Introduction

The basic idea behind abstractor is that more or less standardised `messages` is passed between `nodes` to form an application.

## Messages

A message normally consist of a topic and a payload, but can have any number of additional attributes depending on which node it has passed, or will pass. 

When writing simple applications, you won't have to fiddle with messages manually. They will be silently passed between the nodes you set up.

As an example, a message origination from the MQTT-node will look somthing like this:

```javascript
{
	topic: "indoor/livingroom/roof/lights",
	payload: "on",
	qos: 2,
	retain: false
}
```

And a message indented on it's way to the file-write node will look like this:

```javascript
{
	path: "~/abstractor.log",
	flag: "a", 			// "a" == append, "w" == overwrite
	payload: "This will be appended to abstractor.log"
}
```

Both path and flag can be set at `node` level too, see next section.

## Nodes

Nodes are essentially customized functions, which are designed to execute a specific task as efficiently and transparently as possible.

Some nodes can both receive and emit messages. One such example is the json node, which converts the payload to a json string if it is a javascript object and vice versa.

The nodes connect to eachother thorugh pre-defined events, most nodes emit "success" or "failure" on completion. See the documentation for information on what each node can emit.

Putting it all together, a example that continously tail a file on changes and output the last 10 rows to the console.

```javascript
var

    // Initialize abstractor
    abstractor = require("abstractor"),
	
    // Create node factory
    factory = abstractor()

    // Create nodes
    
    // - Create instance of file-watch node, tell the node to monitor `/var/log/syslog`
    //   This node will emit "success" every time the file changes
    watchNode = 	factory( "file-watch", { path: '/var/log/syslog' }),
    
    // - Create a file-read node, tell it to only read the last 10 rows.
    //   On completion, "success" will be emitted.
    readNode = 		factory( "file-read", { tail: 10 }),
    
    // - In this example, we create a generic node (function wrapper) that just print the payload
    //   to the console.
    outputNode = 	factory( "generic", function (msg) { console.log(msg.payload); });

// Ok, the building blocks is ready, we just got to stack them up.
watchNode.on("success", readNode);
readNode.on("success", outputNode);
```

## Installation

The simplest way to get Abstractor is through npm. Simply run the following in your command line from your project folder.

```npm install abstractor```

### Dependencies

Abstractor itself has very few dependencies. However, certain embedded modules dynamically includes third party libraries. As an example, The telldus modules need http://github.com/hexagon/telldus to work.

The framework will raise an run time error if it is missing an dependency.


## Debugging

### Basic

Basic debugging outputs a timestamped log everytime a node is invoked or triggers a message.

```javascript
var

	// Initialize abstractor
	factory = require('abstractor')({debug: true}),

// ...
```

Will result in something like ...

```
[2016-10-02 21:50:12] CORE > Abstractor ready
[2016-10-02 21:50:12] CORE > Imported node json on the fly.
[2016-10-02 21:50:12] CORE > Imported node file-write on the fly.
[2016-10-02 21:50:12] CORE > Imported node file-read on the fly.
[2016-10-02 21:50:12] JSON > invoked
[2016-10-02 21:50:12] JSON > success
[2016-10-02 21:50:12] FILEWRITE > invoked
[2016-10-02 21:50:12] FILEWRITE > success
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

# Documentation

## Built in nodes

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
