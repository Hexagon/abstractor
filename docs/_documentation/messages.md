---
title: Messages
right_code: |
  ~~~ json
  {
    "topic": "indoor/livingroom/roof/lights",
    "payload": "on",
    "qos": 2,
    "retain": false
  }
  ~~~
  {: title="Message 1" }

  ~~~ json
  {
    "path": "~/abstractor.log",
    "flag": "a",
    "payload": "This will be appended to abstractor.log"
  }
  ~~~
  {: title="Message 2" }
---

A message normally consist of a topic and a payload, but can have any number of additional attributes depending on which node it has passed, or will pass. 

When writing simple applications, you won't have to fiddle with messages manually. They will silently pass between the nodes you set up.

As an example, a message originating from the MQTT-node will look something like this ...

Both path and flag can be set at [node](#nodes) level too, see next section.