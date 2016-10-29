---
title: Template
position: 28
---

Dynamic template module using version 2 of [ant](https://github.com/unkelpehr/ant).

This module allows for {{ message.payload }}, and also {{# js code }}.
The full message is accessible within template through message.property.

Template can be set either through node config.template, or message.template.

Example template:

	Welcome, /\{\{/ message.name /\}\}/!

	<ul>

	/\{\{/# message.payload.forEach(function(link) { /\}\}/
		<li><a href="{{ link.url }}">{{ link.text }} </a></li>
	/\{\{\#/ } /\}\}/

	</ul>

[more (@github.com/unkelpehr/ant)](https://github.com/unkelpehr/ant) ...
