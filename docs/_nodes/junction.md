---
title: Junction
position: 15
---

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
