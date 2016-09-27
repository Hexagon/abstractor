// Licenced under MIT - Abstractor - ©2016 Hexagon <github.com/hexagon>

"use strict";

const
	Pipe = require("../pipe.js"),
	csvHelper = require("fast-csv");

class CSV extends Pipe {

	quote(s) {
		
		// Strings containing double quote, crLf or comma require quoting
		var needQuotes = false;
		if(		s.indexOf && (s.indexOf("\"") !== -1
			|| 	s.indexOf("\r\n") !== -1 
			|| 	s.indexOf(",") !== -1 )
		) needQuotes = true;

		// Return regular string by default, or double quoted string if needed
		return needQuotes ? "\"" + s.replace(/\"/g,"\"\"") + "\"" : s;  

	}

	invoke(msg) {
		
		var self = this;

		// ToDo, headers should have a default, and be passed to this.getConfig

		// Parse if we got a string
		if ( typeof msg.payload == "string" ) {

			var rows = [],
				headers = (this.config.headers === undefined ? true : this.config.headers);

			try {
				var csvFile = csvHelper.fromString(msg.payload, {headers: headers, trim:true});

				csvFile.on("data", function(data){
					rows.push(data);	
				});	

				csvFile.on("end", function(){
					self.success( msg, rows);		
				});
			} catch (e) {
				self.error( msg, "Error whild parsing CSV-file: " + e);
			}

		// Stringify if we got an object
		} else if ( typeof msg.payload == "object" ) {

			// ToDo: Add headers if it is the first object/row of file, and if it is requested
			
			// Force first level to be array
			if( !Array.isArray(msg.payload) ) {
				msg.payload = [msg.payload];
			}
			
			let rowString = "",
				wasFirstLevel = false;

			msg.payload.forEach((row) => {
		
				// If second level is an array
				if( Array.isArray(row) ) {
					row.forEach(function(col) {
						rowString += self.quote(col.toString()) + ",";
					});

					// Finalize this row
					if (rowString.length>0) {
						rowString = rowString.substring(0, rowString.length - 1) + "\r\n";
					}

				// If second level is an object
				} else if ( typeof row === "object" ) {
					Object.keys(row).forEach(function(key) {
						let col = row[key];
						console.log(col,key);
						rowString += self.quote(col.toString()) + ",";
					});	

					// Finalize this row
					if (rowString.length>0) {
						rowString = rowString.substring(0, rowString.length - 1) + "\r\n";
					}

				// If second level is something else, we're actually at "first level"
				} else {

					wasFirstLevel = true;
					rowString += self.quote(row) + ",";

				}

			});

			if( wasFirstLevel ) {
				// Finalize row
				if (rowString.length>0) {
					rowString = rowString.substring(0, rowString.length - 1) + "\r\n";
				}
			}

			this.success( msg, rowString );

		} else {
			return this.error(msg, "CSV node could not determine what to do with payload of type " + typeof msg.payload);

		}
		

	}

}

module.exports = CSV;