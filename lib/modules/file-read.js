/***********************************************************************************

    Abstractor | File reader | MIT License | ©2016 Hexagon <github.com/hexagon>

    Reads a file, capable of reading first/last x rows and first/last x 
    characters.

    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    path             |  string         |  undefined           |  yes
    encoding         |  string         |  utf8                |  yes
    first            |  string         |  undefined           |  no
    last             |  string         |  undefined           |  no
    tail             |  string         |  undefined           |  no
    head             |  string         |  undefined           |  no
    -----------------+-----------------+----------------------+-----------------



    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Input                          |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
                                   |  success             |  payload
    <any message>                  +----------------------+---------------------
                                   |  error               |  payload
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const
	Pipe = require("../pipe.js"),
	fs = require("fs");

class FileRead extends Pipe {

	constructor(parameters) {
		
		var defaults = {
			encoding: "utf8"
		};

		super(parameters, defaults);

	}

	invoke(msg) {
		
		var 
			self = this,

			// Mandatory options
			filePath = this.getConfig("path", msg, true),
			encoding = this.getConfig("encoding", msg, true),

			// Optional options
			first = this.getConfig("first", msg, false),
			last = this.getConfig("last", msg, false),
			tail = this.getConfig("tail", msg, false),
			head = this.getConfig("head", msg, false);
		
		// File path is mandatory, bail out if not found
		if (filePath === undefined) 
			// getConfig has already emitted an error about this
			return;

		// Supply file path to next node
		msg.path = filePath;

		// Read full file
		if (first === undefined && last == undefined && tail == undefined && head == undefined) {
			fs.readFile(filePath, encoding, (err, data) => {
				if (err) return this.error(msg, "An error occurred while reading `"+filePath+"`: " + err.stack);
				this.success(msg, data);
			});

		// Reading first + Last bytes of file is not supported
		} else if ( first !== undefined && last !== undefined) {
			return this.error(msg, "Can not read both first and last characters of file, please read full file, or just first OR last bytes.");

		} else if ( tail !== undefined || head !== undefined ) {

			fs.open(filePath, "r", function(openErr, fd) {
				if ( openErr ) {
					return self.error(msg, "An error occurred while opening `"+filePath+"`: " + openErr.stack);
				}

				fs.fstat(fd, function(statErr, stats) {
					if ( statErr ) {
						fs.close(fd);
						return self.error(msg, "An error occurred while stating `"+filePath+"`: " + statErr.stack);
					}

					var chunk = 1024,
						result = "",
						lines = 0,
						goal = tail || head,
						start = tail ? stats.size : 0;

					// Read file, chunk by chunk, until result is filled with enough lines
					while(lines<goal && (start > 0 || (head && start >= 0)) && ((head && start < stats.size) || (tail && start <= stats.size))) {
						if(tail) start -= chunk;

						if(start < 0) {
							chunk += start;
							start = 0;
						}

						if(head && (start+chunk > stats.size)) {
							chunk = stats.size-start;
						}

						let buffer = new Buffer(chunk);
						fs.readSync(fd, buffer, 0, chunk, start);
						let toAdd = buffer.toString();
						if(tail) {
							result = toAdd + result;	
						} else {
							result = result + toAdd;	
						}
						lines += (toAdd.match(/\n/g) || []).length;
						if(head) start += chunk;
					}

					result = result.split("\n");
					if(tail) {
						start = result.length - tail;
						if (start < 0) start = 0;
						result = result.splice(start,tail).join("\n");
					} else {
						// Don"t forget to remove trailing \r after splitting actual \r\n with only \n
						result = result.splice(0,head).join("\n").replace(/\r+$/, "");
					}

					return self.success( msg, result);

				});

			});

		// Reading first OR last x bytes is however supported
		} else if ( first !== undefined || last !== undefined) {

			fs.open(filePath, "r", function(openErr, fd) {
				if ( openErr ) {
					return self.error(msg, "An error occurred while opening `"+filePath+"`: " + openErr.stack);
				}

				fs.fstat(fd, function(statErr, stats) {
					if ( statErr ) {
						fs.close(fd);
						return self.error(msg, "An error occurred while stating `"+filePath+"`: " + statErr.stack);
					}
					
					var start = first ? 0 : stats.size - last,
						end = first ? first : stats.size,

						buffer = new Buffer(end-start);

					fs.read(fd, buffer, 0, end-start, start, (readErr, bytesRead, buffer) => {
						fs.close(fd);
						if ( readErr ) {
							fs.close(fd);
							return self.error(msg, "An error occurred while reading `"+filePath+"`: " + readErr.stack);
						} else {
							return self.success(msg, buffer.toString(self.config.encoding));
						}

					});

				});

			});

		}

	}

}

module.exports = FileRead;