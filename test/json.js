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

describe("JSON initialization", function () {

    it("Factory should not throw", function () {
        (function(done){
            var 
                // Initialize abstractor
                factory = require("../lib")( { logLevel: 2 } ),

                // Create nodes
                jsonNode1 = factory( "json", {} ),
                jsonNode2 = factory( "json", {} );

        }).should.not.throw();
    });
});

describe("JSON usage", function () {
    it("Running should not throw", function (done) {
        (function(){
            var 
                // Initialize abstractor
                flow = require("../lib")( { logLevel: 2 } ),

                // Create nodes
                jsonNode1 = flow( "json", {} ),
                testPayload = {
                    hellu: "lol",
                    lol: "lal",
                    lil: 1
                },
                testDoneNode = flow( "generic", function (msg) {
                    done();
                });

            jsonNode1.on("success", testDoneNode);
            jsonNode1.start( {
                payload: testPayload
            });

        }).should.not.throw();
    });

    it("Should return the same values", function (done) {
        var 
            // Initialize abstractor
            flow = require("../lib")( { logLevel: 2 } ),

            // Create nodes
            jsonNode1 = flow( "json", {} ),
            jsonNode2 = flow( "json", {} ),
            testPayload = {
                hellu: "lol",
                lol: "lal",
                lel: "1",
                lil: 1
            },
            testDoneNode = flow( "generic", function (msg) {
                if (msg.payload.hellu === testPayload.hellu
                    && msg.payload.lol === testPayload.lol
                    && msg.payload.lel === testPayload.lel
                    && msg.payload.lil === testPayload.lil) {
                    done();
                } else {
                    done(new Error("Output did not equal input"));
                }
            });

        jsonNode1.on("success", jsonNode2);
        jsonNode2.on("success", testDoneNode);
        jsonNode1.start( {
            payload: testPayload
        });
    });

});