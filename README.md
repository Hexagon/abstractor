
# Abstractor

[![Build status](https://travis-ci.org/Hexagon/abstractor.svg)](https://travis-ci.org/Hexagon/abstractor) [![npm version](https://badge.fury.io/js/abstractor.svg)](https://badge.fury.io/js/abstractor)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io/badge/license-MIT-blue.svg)

Node.js abstraction layer and automation framework.

 * [Introduction](#introduction)
   * [Messages](#messages)
   * [Nodes](#nodes)
   * [Examples](#examples)
   * [Installation](#installation)
     * [Dependencies](#dependencies)
   * [Debugging](#debugging)
 * [Documentation](#documentation)
   * [Built in nodes](#built-in-nodes)
     * [Cache](#cache)
     * [Cron](#cron)
     * [CSV](#csv)
     * [Delay](#delay)
     * [Exec](#exec)
     * [File-read](#file-read)
     * [File-watch](#file-watch)
     * [File-write](#file-write)
     * [Generic](#generic)
     * [Heartbeat](#heartbeat)
     * [HTML Parser](#html-parser)
     * [HTTP Client](#http-client)
     * [HTTP Server](#http-server)
     * [JSON](#json)
     * [Kill](#kill)
     * [Mail](#mail)
     * [Map](#map)
     * [MQTT](#map)
     * [MSSQL](#mssql)
     * [MySQL](#mysql)
     * [Split](#split)
     * [Strip](#strip)
     * [Telldus device](#telldus-device)
     * [Telldus sensor](#telldus-sensor)
   * [Third party nodes](#third-party-nodes)
 * [License](#license)

# Introduction

The basic idea behind abstractor is that more or less standardised [messages](#messages) is passed between [nodes](#nodes) to form an application.

## Messages

A message normally consist of a topic and a payload, but can have any number of additional attributes depending on which node it has passed, or will pass. 

When writing simple applications, you won't have to fiddle with messages manually. They will silently pass between the nodes you set up.

As an example, a message originating from the MQTT-node will look something like this ...

```javascript
{
	topic: "indoor/livingroom/roof/lights",
	payload: "on",
	qos: 2,
	retain: false
}
```

... and a message on it's way to the file-write node will look like this ...

```javascript
{
	path: "~/abstractor.log",
	flag: "a", 			// "a" == append, "w" == overwrite
	payload: "This will be appended to abstractor.log"
}
```

Both path and flag can be set at [node](#nodes) level too, see next section.

## Nodes

Nodes are essentially customized functions, which are designed to execute a specific task as efficiently and transparent as possible.

Some nodes can both receive and emit messages. One such example is the json node, which converts the payload to a json string if it is a javascript object and vice versa.

The nodes connect to each other through pre-defined events, most nodes emit "success" or "failure" on completion. See the documentation for information on what each node can emit.

## Examples

To put it all together, an example that continously tail a file on changes and output the last 10 rows to the console.

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

More examples available at [/examples](examples/)

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

Below is just a brief description of each of the nodes. For in-depth documentation, see the source files at [/lib/nodes/](lib/nodes/).

## Built in nodes

### Cache

In memory key/value storage, great for storing the last payload
of a specific topic.

[more](lib/nodes/cache.js) ...
    
### Cron

Competent cron-like scheduler based on croner (github.com/hexagon/croner)

[more](lib/nodes/cron.js) ...

### CSV

CSV parser and generator. Parser uses fast-csv.

If input payload is an array width objects, the contained objects are
converted to CSV rows.

If input payload is a string, the string is parsed to an array of objects.

[more](lib/nodes/csv.js) ...

### Delay

Waits for x milliseconds before passing the message.

[more](lib/nodes/delay.js) ...

### Exec

Executes a command, returns exit code, stdout and stderr.

[more](lib/nodes/exec.js) ...

### File-Read

Reads a file, capable of reading first/last x rows and first/last x 
characters.

[more](lib/nodes/file-read.js) ...

### File-Watch

Watches a file for changes, emits a message on change.

[more](lib/nodes/file-watch.js) ...

### File-Write

Writes payload (string/buffer) to a file, encoding and flag are configurable.

Possible flags:
   a  = append
   w  = overwrite

[more](lib/nodes/file-write.js) ...

### Generic

Converts a regular function to a abstractor node.

[more](lib/nodes/generic.js) ...

### Heartbeat

Monitors the frequency of messages received, outputs "timeout" when no 
message has arrived in x ms.

[more](lib/nodes/heartbeat.js) ...

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

[more](lib/nodes/html.js) ...

### HTTP Client

Gets the response code, body and response headers from an url.
Does follow redirects.

[more](lib/nodes/http-client.js) ...

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

[more](lib/nodes/http-server.js) ...

### JSON

JSON parser and stringifier. When feeded with an object, payload is 
stringified to JSON and vice versa.

[more](lib/nodes/json.js) ...

### Kill

Kills the current process when receiving a message. Exit code is configurable
through node config (exitCode), or through message property (also exitCode).

[more](lib/nodes/kill.js) ...

### Mail

Sends mail using nodemailer. Options are passed as is, see: 

https://github.com/nodemailer/nodemailer#set-up-smtp

[more](lib/nodes/mail.js) ...

### Map

Replaces the values of configured column in a dataset with another value.

The first time the node is invoked, it expects a map (key-valye object or
array of key->value arrays) to be passed as message.payload.

[more](lib/nodes/map.js) ...

### MQTT

Subscribe to topics, and send messages to a MQTT network. Supports 
setting/getting qos and retain flag.

[more](lib/nodes/mqtt.js) ...

### MSSQL

No less, no more.

[more](lib/nodes/mssql.js) ...

### MySQL

No less, no more.

[more](lib/nodes/mysql.js) ...

### Split

Splits an incoming array and emits one separate "item" message per item.

If messages are redirected back into this module after they are processed,
the module keeps track of when all messages are processed, and emit an
"success" event.

[more](lib/nodes/split.js) ...

### Strip

Removed unwanted properties before apssing the message firther.

[more](lib/nodes/strip.js) ...

### Telldus device

Listens for status changes, and sets status of a configured telldus device.

[more](lib/nodes/telldus-device.js) ...

### Telldus sensor

Listens for sensor updates in telldus network.

[more](lib/nodes/telldus-sensor.js) ...

## Third party nodes

It's up to you, see lib/modules/ for inspiration.

# License

MIT
