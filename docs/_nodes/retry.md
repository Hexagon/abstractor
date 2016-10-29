---
title: Retry
position: 22
---

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