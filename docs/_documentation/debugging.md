---
title: Debugging
---

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