var 
    // Initialize abstractor
    $ = require("../lib")({ debug: true}),

    // Utilities;
    extend =    require("util")._extend,

    // Create nodes
    telldusDeviceListenerNode = $("telldus-device", { listen: true }),

    telldusDevice5On = $("telldus-device", { deviceId: 5, deviceAction: "turnOn" }),
    telldusDevice5Off = $("telldus-device", { deviceId: 5, deviceAction: "turnOff" }),
    
    httpNode = flow( "http-server", { port: 8087 }),
    cacheNode   = flow( "cache" );
    dumpCacheNode   = flow( "generic", function (msg) { return extend(msg, { dump: true }); } );


// HTTP /fullcache -> get all cache entries -> response
httpNode.on("/cache/dump", dumpCacheNode);
    dumpCacheNode.on("success", cacheNode);
        cacheNode.on("success", httpNode);

// Connect nodes
telldusDeviceListenerNode.on("received", cacheNode);

httpNode.on("/device/5/on", telldusDevice5On);
    telldusDevice5On.on( "success", httpNode);

httpNode.on("/device/5/off", telldusDevice5Off);
    telldusDevice5Off.on( "success", httpNode);