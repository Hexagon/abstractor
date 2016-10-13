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

var should = require("should");

describe("CSV initialization", function () {

    it("Factory should not throw", function () {
        (function(done){
            var 
                // Initialize abstractor
                factory = require("../lib")( { logLevel: 2 } ),

                // Create nodes
                csv = factory( "csv", {} );

        }).should.not.throw();
    });
});

describe("CSV usage", function () {
    it("Running should not throw", function (done) {
        (function(){
            var 
                // Initialize abstractor
                flow = require("../lib")( { logLevel: 2 } ),

                // Create nodes
                csvNode1 = flow( "csv", {} ),
                testPayload = ["lol\"","lal\r\nas\nd",123,"\"\"lol\"\""],
                testDoneNode = flow( "generic", function (msg) {
                    done();
                });

            csvNode1.on("success", testDoneNode);
            csvNode1.start( {
                payload: testPayload
            });

        }).should.not.throw();
    });

    it("Should return the same values", function (done) {
        var 
            // Initialize abstractor
            flow = require("../lib")( { logLevel: 2 } ),

            // Create nodes
            csvNode1 = flow( "csv", {} ),
            csvNode2 = flow( "csv", { headers: false } ),
            testPayload = [ ["lol\"","lal\r\nas\nd",123,"\"\"lol\"\""] ],
            testDoneNode = flow( "generic", function (msg) {
                if (msg.payload[0][0] === testPayload[0][0]
                    && msg.payload[0][1] === testPayload[0][1]
                    && msg.payload[0][2] == testPayload[0][2]
                    && msg.payload[0][3] === testPayload[0][3]) {
                    done();
                } else {
                    done(new Error("Output did not equal input"));
                }
            });

        csvNode1.on("success", csvNode2);
        csvNode2.on("success", testDoneNode);
        csvNode1.start( {
            payload: testPayload
        });
    });

});