var 
    // Initialize abstractor
    flow = require("../lib")({ logLevel: 2});

    genError = flow("generic", function (msg) { 
    	this.log.warning("DEBUG", 'Woop');
    	this.log.notice("DEBUG", 'Hellu');
    	this.log.error("DEBUG", 'Woah!',"lol");
    	this.log.log("DEBUG", "Alpha");
    	this.log.throw("DEBUG", "I'm outta here");
    });

genError.start({});