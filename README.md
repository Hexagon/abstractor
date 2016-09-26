
# Abstractor

[![Build status](https://travis-ci.org/Hexagon/abstractor.svg)](https://travis-ci.org/Hexagon/abstractor) [![npm version](https://badge.fury.io/js/abstractor.svg)](https://badge.fury.io/js/abstractor)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://img.shields.io/badge/license-MIT-blue.svg)

Node.js abstraction layer and automation framework.

Note that this is a fully working library, but it is work in progress. Expect compability breaks even between minor version bumps.



# Installation

## From npm

```npm install abstractor```

## Dependencies

Abstractor itself has very few dependencies. However, certain built-in modules dynamically includes third party libraries. As an example, The telldus-modules need http://github.com/hexagon/telldus to work.

The framework will raise an run-time error if a dependency is missing.



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

## Message Cache

## Cron scheduler

## CSV Generator/Parser

## Delay

## Exec

## File-Read

## File-Watch

## File-Write

## Generic node factory

## Heartbeat

## HTML Parser

## HTTP Client

## HTTP Server

## JSON Generator/Parser

## Process killer

## Mail sender

## Key-Value mapper

## MQTT Client

## MSSQL Client

## MySQL Client

## Array splitter

## Message stripper

## Telldus device controller

## Telldus sensor reader



# License

MIT
