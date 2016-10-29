---
title: Queue
position: 31
---

Synchronous message queue. 

Passes next message by emitting "item" when the previous has
returned. Emits "drained" whenever queue becomes empty.

The default is to process the queue synchronously, is is however possible to 
allow concurrency by increasing "concurrency" option above the default of 1.
