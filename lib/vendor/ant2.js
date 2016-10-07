/* ant2

The MIT License (MIT)

Copyright (c) 2016 Pehr Boman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

(function (self, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], function () { return factory; });
	} else if (typeof exports === 'object') { // Node
		module.exports = factory;
	} else {
		// Attaches to the current context.
		self.ant2 = factory;
	}
}(this, function () {
	var arr = arguments,
		len = arr.length;

	arr[len - 1] = 
		// Start function off be declaring `s` (the output variable) and setting it as an open string.
		"var s='" +
		(
			arr[len - 1]
				/**
				 * Escapes any single quotes (' => \') that is not between code blocks ({{<script>}}). 
				 * Matches one or more single quote (') characters if either "{{" or the end-of-input can be seen ahead without encountering any "}}" in between.
				 * /
				 * 		' 				# Match a single quote
				 * 		(?= 			# Start positive lookahead
				 * 			(?! 		# Start negative lookahead
				 * 				{{ 		# Match literal "{{"
				 * 				| 		# Or
				 * 				}} 		# Match literal "}}"
				 * 			) 			# End negative lookahead
				 * 		 	.* 			# Match anything, zero or more times
				 * 		 	{{ 			# Up until literal "{{"
				 * 		 	| 			# Or
				 * 		 	$ 			# End of line
				 * 		) 				# End positive lookahead
				 * /g 					# g-modifier; match all.
				 */
				.replace(/'(?=(?!{{|}}).*{{|$)/g, "\\'")

				/**
				 * Matches {{# <code> }}-blocks.
				 * Matches get replaced with ';\n$1\ns+=' which transforms into:
				 * '; 	// End previous statement
				 * $1 	// Capturing group 1; content to-be evaluated as Javascript code.
				 * s+=' // Start next statement, with open string.
				 *
				 * Example:
				 * Before: 	"<ul> {{# while(isTrue) { }} <li></li> {{# } }} </ul>"
				 * After: 	s+='ul'; while(isTrue) { s+='<li</li>'; } s+='</ul>';
				 * 
				 * /
				 * 		[\t ]* 			# Match any indentation zero or more times
				 * 		{{# 			# Match literal "{{#"
				 * 		[\t ]* 			# Match any indentation zero or more times
				 * 		( 				# Open capturing group 1
				 * 			[\s\S]*? 	# Match anything zero or more times, until the first occurrence of the following part of the expression.
				 * 						# -> it is tempting to use the faster alternative [^] (match anything except nothing), but it breaks in IE7 and IE9 returns an empty group.
				 * 			(?:			# Open non-capture group
				 * 				}? 		# Match literal "}" zero or one time
				 * 			) 			# Close non-capture group
				 * 		) 				# Close capturing group 1
				 * 		}} 				# Match literal "}}"
				 * 		(?:\r?\n)?		# Non-capture literal "\r\n" or "\n" zero or one time
				 * /g
				 */
				.replace(/[\t ]*{{#[\t ]*([\s\S]*?(?:})?)}}(?:\r?\n)?/g, "';\n$1\ns+='")

				/**
				 * Matches {{ <interpolation> }}-blocks.
				 * Matches get replaced with '+($1)+' which transforms into:
				 * ' 	// Close previous string
				 * + 	// Concatenate string with ...
				 * ($1) // ... the content of capturing group 1; wrapped by parentheses.
				 * + 	// Concatenate the content of group 1 with ...
				 * ' 	// ... the rest of the string.
				 *
				 * Example:
				 * Before: 	"<li>{{isMale ? 'Mr' : 'Ms'}}. {{name}}</li>"
				 * After: 	s+='<li>' + (isMale ? 'Mr' : 'Ms') + '. ' + (name) + '</li>'
				 * 
				 * /
				 * 		{{ 				# Match literal "{{"
				 * 		( 				# Open group 1
				 * 			[\s\S]*? 	# Match anything zero or more times, until the first occurrence of the following part of the expression.
				 * 		) 				# End group 1
				 * 		}} 				# Match literal "}}"
				 * /g 					# g-modifier; match all.
				 */
				.replace(/{{([\s\S]*?)}}/g, "'+($1)+'") +

				// Close of the previous statement. This is important because the following
				// regular expressions relies on an even number of single quotes (hence the wrapping parentheses).
				"';"
		)

		/**
		 * Matches all newlines encapsulated by single quotes and escapes them.
		 * 
		 * /
		 * 		(?! 				# Negative lookahead. Assert that what immediately follows the current position in the string is not ...
		 * 			(?: 			# Open non-capture group 1
		 * 				(?: 		# Open non-capture group 2
		 * 					[^']*' 	# ... any character except a single quote, matched zero or more times immediately followed by a single quote ...
		 * 				){2} 		# Close non-capture group 1, matched exactly 2 times
		 * 			)*				# Close non-capture group 2, matched zero or more times
		 *    		[^']*$ 			# ... or any character except a single quote, matched zero or more times, followed by the end of the string
		 *    	) 					# Close negative lookahead
		 *    	\r?\n{1} 			# Negative lookahead is positive; match literal "\r\n" or "\n" exactly 1 time.
		 * 	/g
		 *
		 * The replacement... looks a bit funky.
		 * What we do is check if the template holds any carriage returns (\r) and if so, we'll escape using "\\r\\n" otherwise just "\n".
		 */
		.replace(/(?!(?:(?:[^']*'){2})*[^']*$)(?:\r?\n){1}/g, (-arr[len - 1].indexOf('\r') ? '\\n' : '\\r\\n'))

		/**
		 * Matches all tabs encapsulated by single quotes and escapes them.
		 * The regex is almost identical to the previous one.
		 */
		.replace(/(?!(?:(?:[^']*'){2})*[^']*$)\t{1}/g, '\\t')

		/**
		 * Matches empty `s`-string concatenations; s+=''; 
		 * This isn't vital but shaves of a few ms and keeps the generated code cleaner for debugging purposes.
		 * 
		 * /
		 * 		s\+=''; 		# Match literal "s+='';"
		 * 	/g					# g-modifier; match all.
		 */
		.replace(/s\+='';/g, '') +

		// End the function by closing the previous statement and returning `s`.
		"\nreturn s;";

	/**
	 * Version 0.5
	 * 
	 * Creates and returns a new function from `tpl` which will be used for generating the templates.
	 * @param {*} data The data source made available for the template.
	 * @example
	 * 		// Create generator
 	 * 		var generator = ant([
 	 * 			'<ul>',
 	 * 			'	{{# var user, i = 0, foo = \'\', baz = {}; }}',
 	 * 			'	{{# while ((user = data.users[i++])) { }}',
 	 * 			'		<li>{{user.name}}, age {{user.age}}</li>',
 	 * 			'	{{# } }}',
 	 * 			'</ul>'
 	 * 		].join('\n'));
 	 *
 	 *		// Generated function (indentated)
 	 *		function (data) {
	 *	  		var s='<ul>\n';
	 *			var user, i = 0, foo = '', baz = {};
	 *			while ((user = data.users[i++])) {
	 *				s+='\t\t<li>'+(user.name)+', age '+(user.age)+'</li>\n';
 	 *			}
 	 *			s+='</ul>';
 	 *			return s;
 	 *   	}
 	 *
 	 * 		// Run it with `data` passed
	 * 		generator({
	 * 	 		users: [ 
	 * 		  		{ name: 'Tawna Mosley', age: 50 },
	 * 				{ name: 'Sonny Poffenberger', age: 36 },
	 * 				{ name: 'Kenneth Otte', age: 58 },
	 * 				{ name: 'Marva Pittard', age: 42 }
	 * 	 	 	]
	 *    	});
	 *
	 * 		// Profit
	 *   	<ul>
	 * 			<li>Tawna Mosley, age 50</li>
	 * 			<li>Sonny Poffenberger, age 36</li>
	 * 			<li>Kenneth Otte, age 58</li>
	 * 			<li>Marva Pittard, age 42</li>
	 *    	</ul> 
	 */
	 return Function.apply(Function, arguments);
}));