var 
    // Initialize abstractor
    flow = require("../lib")(),
    junctionNode = flow("junction");

// Connect yksi and kaksi, but not kolme
junctionNode.on("yksi", "Yksi done!");
junctionNode.on("kaksi", "Kaksi done!");

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