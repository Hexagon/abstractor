---
title: Nodes
position: 3
---

Nodes are essentially customized functions, which are designed to execute a specific task as efficiently and transparent as possible.

Some nodes can both receive and emit messages. One such example is the json node, which converts the payload to a json string if it is a javascript object and vice versa.

The nodes connect to each other through pre-defined events, most nodes emit "success" or "failure" on completion. See the documentation for information on what each node can emit.
