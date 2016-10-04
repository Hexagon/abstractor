var 
    // Initialize abstractor
    flow = require("../lib")({ debug: true }),

    junctionNode = flow("junction"),
    doneNode = flow("generic", function (msg) {  console.log("Done:", msg); });

// Connect yksi and kaksi, but not kolme
junctionNode.on("yksi", doneNode);
junctionNode.on("kaksi", doneNode);

// Go!
junctionNode.start({
	topic: "yksi",
	payload: "this is yksi"
});
junctionNode.start({
	topic: "kaksi",
	payload: "this is kaksi"
});

// Kolme will never arrive
junctionNode.start({
	topic: "kolme",
	payload: "this is kolme"
});