var 
    // Initialize abstractor
    f = require("../lib")({ debug: false, verbose: false }),

    // Create nodes
    split =     f("split"),
    template =  f( "template", { template: "Hello {{ message.payload }}!" }),
    debug =     f("generic", function (msg)  { this.log.info("OUTPUT", msg.payload) } );

split.on("item", template);
    template.on("success", debug);

split.start({payload: ["Robin", "Jonas", "Anders"]});
