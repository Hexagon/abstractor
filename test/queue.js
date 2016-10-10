/*

Copyright (c) 2016 Hexagon <robinnilsson@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

/* eslint no-unused-vars: 0 */

"use strict";

var should = require("should"),
    Cron = require("../index.js");

describe("Message passing", function () {

    it("Double callbacks should not throw", function () {
        (function() {
            var f = require("../lib")({ debug: false }),

                queue = f( "queue" ),
                async = f( "generic" , function (msg, cbk) { cbk(msg);cbk(msg); });

            queue.on( "item", async);
                async.on( "success", queue );
            
            queue.start( {payload: "Test"} );
            
        }).should.not.throw();
        
    });

   it("Delayed callbacks should work throw", function () {
        (function() {
            var f = require("../lib")({ debug: false }),

                queue = f( "queue" ),
                async = f( "generic" , function (msg, cbk) { cbk(msg);cbk(msg); });

            queue.on( "item", async);
                async.on( "success", queue );
            
            queue.start( {payload: "Test"} );
            
        }).should.not.throw();
        
    });


});