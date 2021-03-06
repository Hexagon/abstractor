
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
     * [Junction](#junction)
     * [Kill](#kill)
     * [Mail](#mail)
     * [Map](#map)
     * [MQTT](#map)
     * [MSSQL](#mssql)
     * [MySQL](#mysql)
     * [Retry](#retry)
     * [Split](#split)
     * [Strip](#strip)
     * [Sun](#sun)
     * [Telldus device](#telldus-device)
     * [Telldus sensor](#telldus-sensor)
     * [Template](#template)
     * [Websocket Server](#websocket-server)
     * [Websocket Client](#websocket-client)
     * [Queue](#queue)
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

### logLevel

The logger has 5 levels of verbosity

 * 0 = Silent
 * 1 = adds errors
 * 2 = adds warnings
 * 3 = adds logs
 * 4 = adds notices (default)
 * 5 = adds full message for each invoke

Default mode (4) outputs a timestamped log everytime a node triggers a message.

```javascript
var

	// Initialize abstractor
	factory = require('abstractor')({logLevel: 4}),

// ...
```

Will result in something like ...

```
[2016-10-02 21:50:12] CORE > Abstractor ready
[2016-10-02 21:50:12] CORE > Imported node json on the fly.
[2016-10-02 21:50:12] CORE > Imported node file-write on the fly.
[2016-10-02 21:50:12] CORE > Imported node file-read on the fly.
[2016-10-02 21:50:12] JSON > success
[2016-10-02 21:50:12] FILEWRITE > success
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


**Related examples:**
 * [examples/heartbeat.js](examples/heartbeat.js)

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

**Related examples:**
 * [examples/ping.js](examples/ping.js)

### File-Read

Reads a file, capable of reading first/last x rows and first/last x 
characters.

[more](lib/nodes/file-read.js) ...

**Related examples:**
 * [examples/json.js](examples/json.js)
 * [examples/tail.js](examples/tail.js)
 
### File-Watch

Watches a file for changes, emits a message on change.

[more](lib/nodes/file-watch.js) ...


**Related examples:**
 * [examples/tail.js](examples/tail.js)

### File-Write

Writes payload (string/buffer) to a file, encoding and flag are configurable.

Possible flags:
   a  = append
   w  = overwrite

[more](lib/nodes/file-write.js) ...

**Related examples:**
 * [examples/json.js](examples/json.js)

### Generic

Converts a regular function to a abstractor node.

[more](lib/nodes/generic.js) ...

**Related examples:**
 * [examples/batchcollect.js](examples/batchcollect.js)
 * [examples/mqttwsbridge.js](examples/mqttwsbridge.js)
 * [examples/ping.js](examples/ping.js)
 * [examples/tail.js](examples/tail.js)
 
 
### Heartbeat

Monitors the frequency of messages received, outputs "timeout" when no 
message has arrived in x ms.

[more](lib/nodes/heartbeat.js) ...

**Related examples:**
 * [examples/heartbeat.js](examples/heartbeat.js)

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

**Related examples:**
 * [examples/httpserver.js](examples/httpserver.js)
 * [examples/ping.js](examples/ping.js)

### JSON

JSON parser and stringifier. When feeded with an object, payload is 
stringified to JSON and vice versa.

[more](lib/nodes/json.js) ...

**Related examples:**
 * [examples/json.js](examples/json.js)

### Junction
 
Emits messages with incoming topic as event name.

```javascript
{ 
    topic: "hellu", 
    payload: <data>
}
```

Will be passed with

```javascript
junctionNode.on( "hellu", <receiver> );
```

[more](lib/nodes/junction.js) ...

**Related examples:**
 * [examples/junction.js](examples/junction.js)

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

**Related examples:**
 * [examples/mqttwsbridge.js](examples/mqttwsbridge.js)

### MSSQL

Query can be set with <node options>.query OR msg.query OR msg.topic, 
prioritized in that order.

Parameters can be set with <node options>.parameters OR msg.parameters.

{
    topic: "SELECT @mystring as greeting, * FROM table WHERE id = @id",
    parameters: {
        id: 1531512,
        mystring: "Hellu"
    }
}

[more](lib/nodes/mssql.js) ...

### MySQL

MySQL client node.

Query can be set with <node options>.query OR msg.query OR msg.topic, 
prioritized in that order.

Parameters can be set with <node options>.parameters OR msg.parameters.

{
    topic: "SELECT :mystring as greeting, * FROM table WHERE id = :id",
    parameters: {
        id: 1531512,
        mystring: "Hellu"
    }
}

[more](lib/nodes/mysql.js) ...


### Retry

Very simple node that clear process.exitCode and emit success. 

Useful when you need to retry an action that have emitted error.

Number of retry is set in node config

```javascript

// ...

delay = f( "delay", { delay: 5000 });
retry = f( "retry", { retries: 5 }s);

// ...

// If MySQL emit error, retry after 5 seconds
mysql.on("error", 
    retry.on("success", 
      delay.on("success", mysql)));

```

[more](lib/nodes/retry.js) ...

### Split

Splits an incoming array and emits one separate "item" message per item.

[more](lib/nodes/split.js) ...

**Related examples:**
 * [examples/queue.js](examples/queue.js)

### Strip

Removed unwanted properties before apssing the message firther.

[more](lib/nodes/strip.js) ...

### Sun

Emits a message on sun events.

Possible triggers:
 * sunrise
 * sunset
 * dusk
 * night
 * dawn

[more](lib/nodes/sun.js) ...

**Related examples:**
 * [examples/sun.js](examples/sun.js)

### Telldus device

Listens for status changes, and sets status of a configured telldus device.

[more](lib/nodes/telldus-device.js) ...

### Telldus sensor

Listens for sensor updates in telldus network.

[more](lib/nodes/telldus-sensor.js) ...

### Template

Dynamic template module using version 2 of [ant](https://github.com/unkelpehr/ant).

This module allows for {{ message.payload }}, and also {{# js code }}.
The full message is accessible within template through message.property.

Template can be set either through node config.template, or message.template.

Example template:

	Welcome, {{ message.name }}!

	<ul>

	{{# message.payload.forEach(function(link) { }}
		<li><a href="{{ link.url }}">{{ link.text }} </a></li>
	{{# } }}

	</ul>

[more (@github.com/unkelpehr/ant)](https://github.com/unkelpehr/ant) ...

**Related examples:**
 * [examples/template.js](examples/template.js)

### Websocket Server

Simple WS server.

[more](lib/nodes/ws-server.js) ...

**Related examples:**
 * [examples/mqttwsbridge.js](examples/mqttwsbridge.js)

### Websocket Client

Reconnecting websocket client.

[more](lib/nodes/wsclient.js) ...

**Related examples:**
 * [examples/wsclient.js](examples/wsclient.js)

### Queue

Synchronous message queue. 

Passes next message by emitting "item" when the previous has
returned. Emits "drained" whenever queue becomes empty.

The default is to process the queue synchronously, is is however possible to 
allow concurrency by increasing "concurrency" option above the default of 1.

[more](lib/nodes/queue.js) ...

**Related examples:**
 * [examples/queue.js](examples/queue.js)

## Third party nodes

It's up to you, see [lib/modules/](/lib/modules/) for inspiration.

# License

MIT
