/***********************************************************************************

    Abstractor | Template | MIT L. | ©2016 Hexagon <github.com/hexagon>

    Dynamic template module using version 2 of [ant](https://github.com/unkelpehr/ant).

    This module allows for {{ message.payload }}, and also {{# js code }}.
    The full message is accessible within template through message.property.

	Template can be set either through node config.template, or message.template.

    Example template:

    	Welcome, {{ message.name }}!

		<ul>

		{{# message.payload.forEach(function(link) { }}
    		<li><a href="{{ link.url }}">{{ link.text }} </a></li>
    	{{# } }}

    	</ul>

    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    template         |  string         |  undefined           |  no
    -----------------+-----------------+----------------------+-----------------


    I/O

    -------------------------------+----------------------+---------------------
    Input                          |  Possible triggers   |  Output
    -------------------------------+----------------------+---------------------
    <any message>                  |  success             |  payload
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const	Pipe = require("../pipe.js"),
		ant2 = require("../vendor/ant2.js");

class Template extends Pipe {

	constructor(parameters) {
		
		var defaults = {};

		super(parameters, defaults);

	}

	invoke(msg) {
		
		var self = this,

			template = this.getConfig("template", msg),

			generator;

		if ( template === undefined ) return self.error(msg, "No template specificed.");

		this.success(msg, ant2("message", template)(msg));

	}

}

module.exports = Template;