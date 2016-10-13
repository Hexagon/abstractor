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

describe("Generic node", function () {

    it("Factory should not throw", function () {
        (function(done){
            var 
                // Initialize abstractor
                factory = require("../lib")( { logLevel: 2 } ),

                // Create nodes
                genericNode = factory( "generic", function(msg) { } );

        }).should.not.throw();
    });

    it("Return type callback should work", function (done) {

        var 
            // Initialize abstractor
            factory = require("../lib")( { logLevel: 2 } ),

            // Create nodes
            genericNode1 = factory( "generic", function(msg) { return msg; } ),
            genericNode2 = factory( "generic", function(msg) { done(); } );

        genericNode1.on("success", genericNode2);
        genericNode1.start({});

    });

    it("Omitting return should not invoke next", function (done) {

        var 
            // Initialize abstractor
            factory = require("../lib")( { logLevel: 2 } ),

            hasRun = false,

            // Create nodes
            genericNode1 = factory( "generic", function(msg) { } ),
            genericNode2 = factory( "generic", function(msg) { hasRun = true; } );

        genericNode1.on("success", genericNode2);
        genericNode1.start({});

        setImmediate(function() { if (!hasRun) done(); });

    });

    it("Returning undefined should not invoke next", function (done) {

        var 
            // Initialize abstractor
            factory = require("../lib")( { logLevel: 2 } ),

            hasRun = false,

            // Create nodes
            genericNode1 = factory( "generic", function(msg) { return undefined; } ),
            genericNode2 = factory( "generic", function(msg) { hasRun = true; } );

        genericNode1.on("success", genericNode2);
        genericNode1.start({});

        setImmediate(function() { if (!hasRun) done(); });

    });

    it("Returning should invoke next", function (done) {

        var 
            // Initialize abstractor
            factory = require("../lib")( { logLevel: 2 } ),

            hasRun = false,

            // Create nodes
            genericNode1 = factory( "generic", function(msg) { return msg; } ),
            genericNode2 = factory( "generic", function(msg) { hasRun = true; } );

        genericNode1.on("success", genericNode2);
        genericNode1.start({});

        setImmediate(function() { if (hasRun) done(); });

    });


    it("Message should be passed when using callback", function (done) {
        var 
            // Initialize abstractor
            factory = require("../lib")( { logLevel: 2 } ),

            // Create nodes
            genericNode1 = factory( "generic", function(msg, callback) { callback(msg); } ),
            genericNode2 = factory( "generic", function(msg) { 
                if (msg.payload == "test") {
                    done(); 
                } else {
                    done(new Error("Message was not passed"));
                }
            });

        genericNode1.on("success", genericNode2);
        genericNode1.start({ payload: "test" });

    });

    it("Message should be passed when using return", function (done) {
        var 
            // Initialize abstractor
            factory = require("../lib")( { logLevel: 2 } ),

            // Create nodes
            genericNode1 = factory( "generic", function(msg) { return msg; } ),
            genericNode2 = factory( "generic", function(msg) { 
                if (msg.payload == "test") {
                    done(); 
                } else {
                    done(new Error("Message was not passed"));
                }
            });

        genericNode1.on("success", genericNode2);
        genericNode1.start({ payload: "test" });

    });


    it("Passed message should have changed when using callback", function (done) {
        var 
            // Initialize abstractor
            factory = require("../lib")( { logLevel: 2 } ),

            // Create nodes
            genericNode1 = factory( "generic", function(msg, callback) { msg.payload = "test2"; callback(msg); } ),
            genericNode2 = factory( "generic", function(msg) { 
                if (msg.payload == "test2") {
                    done(); 
                } else if (msg.payload == "test") {
                    done(new Error("Message was not changed"));
                } else {
                    done(new Error("Message was not passed"));
                }
            });

        genericNode1.on("success", genericNode2);
        genericNode1.start({ payload: "test" });

    });


    it("Passed message should have changed when using return", function (done) {
        var 
            // Initialize abstractor
            factory = require("../lib")( { logLevel: 2 } ),

            // Create nodes
            genericNode1 = factory( "generic", function(msg) { 
                msg.payload = "test2"; 
                return msg; 
            }),
            genericNode2 = factory( "generic", function(msg) { 
                if (msg.payload == "test2") {
                    done(); 
                } else if (msg.payload == "test") {
                    done(new Error("Message was not changed"));
                } else {
                    done(new Error("Message was not passed"));
                }
            });

        genericNode1.on("success", genericNode2);
        genericNode1.start({ payload: "test" });

    });
});
