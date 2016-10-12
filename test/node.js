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

    it("Messages should not be traced upstream", function () {
        var f = require("../lib")( { logLevel: 2 } ),

            node1 = f( "generic" , function (msg, callback) { msg.payload = 1; callback(msg); }),
            node5 = f( "generic" , function (msg) { return msg; }),
            node2 = f( "generic" , function (msg, callback) { callback(msg); }),
            node3 = f( "generic" , function (msg, callback) { callback(msg); }),
            node4 = f( "generic" , function (msg) { msg.__trace.length.should.equal(2); });

        node1.on( "success", node2);
        node1.on( "success", node5);
        node1.on( "success", node3);
        node3.on( "success", node4);

        node1.start({});

    });

    it("Messages should not change upstream", function () {
        var f = require("../lib")( { logLevel: 2 } ),

            node1 = f( "generic" , function (msg, callback) { callback(msg); }),
            node5 = f( "generic" , function (msg) { msg.payload = 2; return msg; }),
            node2 = f( "generic" , function (msg, callback) { msg.payload = 2; callback(msg); }),
            node3 = f( "generic" , function (msg, callback) { callback(msg); }),
            node4 = f( "generic" , function (msg) { msg.payload.should.equal(1); });

        node1.on( "success", node2);
        node1.on( "success", node5);
        node1.on( "success", node3);
        node3.on( "success", node4);

        node1.start({payload: 1});

    });

    it("Messages should change downstream", function () {
        var f = require("../lib")( { logLevel: 2 } ),

            node1 = f( "generic" , function (msg, callback) { callback(msg); }),
            node5 = f( "generic" , function (msg) { msg.payload = 2; return msg; }),
            node2 = f( "generic" , function (msg, callback) { msg.payload = 2; callback(msg); }),
            node3 = f( "generic" , function (msg, callback) { msg.payload = 3; callback(msg); }),
            node4 = f( "generic" , function (msg) { msg.payload.should.equal(3); });

        node1.on( "success", node2);
        node1.on( "success", node5);
        node1.on( "success", node3);
        node3.on( "success", node4);

        node1.start({payload: 1});

    });

    it("Messages should not be traced twice", function () {
        var f = require("../lib")( { logLevel: 2 } ),

            node1 = f( "generic" , function (msg, callback) { callback(msg); }),
            node2 = f( "generic" , function (msg, callback) { this.traceback(msg).should.equal(false); });

        node1.on( "success", node2);

        node1.start({});

    });


    it("Messages should not be traced twice 2", function (next) {
        var f = require("../lib")( { logLevel: 2 } ),


            node1 = f( "generic" , function (msg, callback) { callback(msg); }),
            split = f( "split" ),
            queue = f( "queue" ),
            first = f( "generic", function (msg) { return msg; }),
            item = f( "generic", function (msg) { return msg; }),
            done = f( "generic", function (msg) { msg.__trace.length.should.equal(3); next(); } );

        node1.on( "success", split);
        split.on( "item", queue);

        queue.on( "started", first);
        queue.on( "item", item);
        item.on( "success", queue);

        queue.on( "drained", done);

        node1.start({payload: [1,2,3,4,5,6,7,8,9]});

    });

});