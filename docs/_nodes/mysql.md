---
title: MySQL
position: 21
---

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