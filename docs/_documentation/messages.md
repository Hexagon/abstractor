---
title: Messages
position: 2
right_code: |
  ~~~
  {: title="Message 1" }
  ~~~ javascript
{
  topic: "indoor/livingroom/roof/lights",
  payload: "on",
  qos: 2,
  retain: false
}
  ~~~
  {: title="Message 2" }

  ~~~ javascript
{
  path: "~/abstractor.log",
  flag: "a",      // "a" == append, "w" == overwrite
  payload: "This will be appended to abstractor.log"
}
---

A message normally consist of a topic and a payload, but can have any number of additional attributes depending on which node it has passed, or will pass. 

When writing simple applications, you won't have to fiddle with messages manually. They will silently pass between the nodes you set up.

As an example, a message originating from the MQTT-node will look something like this ...

Both path and flag can be set at [node](#nodes) level too, see next section.