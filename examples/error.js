var 
    // Initialize abstractor
    flow = require("../lib")({ debug: true });

    genError = flow("generic", function (msg) { 
    	this.log.warning("DEBUG", 'Woop');
    	this.log.info("DEBUG", 'Hellu');
    	this.log.error("DEBUG", 'Woah!',"lol");
    	this.log.info("DEBUG", "Alpha");
    	this.log.throw("DEBUG", "I'm outta here");
    });

genError.start({});