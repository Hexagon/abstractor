/***********************************************************************************

    Abstractor | File writer | MIT License | ©2016 Hexagon <github.com/hexagon>

    Writes payload (string/buffer) to a file, encoding and flag are configurable.

	Possible flags:
	   a  = append
	   w  = overwrite

	Possible mdoes:

    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    path             |  string         |  undefined           |  yes
    encoding         |  string         |  utf8                |  yes
    mode             |  string         |  0o666               |  yes
    flag             |  string         |  a                   |  yes
    -----------------+-----------------+----------------------+-----------------


    I/O

    -------------------------------+----------------------+---------------------
    Input                          |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
                                   |  success             |  <none>
    payload: <string/buffer>       +----------------------+---------------------
                                   |  error               |  error
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const
	Pipe = require("../pipe.js"),
	fs = require("fs");

class FileWrite extends Pipe {

	constructor(parameters) {
		
		var defaults = {
			encoding: "utf8",
			mode: 0o666,
			flag: "a"
		};

		super(parameters, defaults);

	}

	invoke(msg) {

		var 
			self = this,

			// Mandatory options
			filePath = this.getConfig("path", msg, true),

			// Optinal options, defaults are append, read/write permissions to all and utf8 encoding
			encoding = this.getConfig("encoding", msg, true),
			mode = this.getConfig("mode", msg, true),
			flag = this.getConfig("flag", msg, true);

		// File path is mandatory, bail out if not found
		if (filePath === undefined)
			// getConfig has already emitted an error about this
			return;

		// Supply file path to next node
		msg.path = filePath;

		fs.writeFile(filePath, msg.payload, { encoding, mode, flag }, function (err) {
			if(err) return self.error( msg, "Error while reading file, " + err );

			// No need to replace payload
			return self.success(msg, msg.payload);
		});

	}

}

module.exports = FileWrite;