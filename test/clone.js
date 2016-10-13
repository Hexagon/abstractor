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
    clone = require("../lib/vendor/clone.js");

describe("Deep Extend / Clone (lib/vendor/clone.js)", function () {

    it("Basic usage should not throw", function () {
        (function(done){
            var a = clone({});
        }).should.not.throw();
    });

    it("Cloning a simple object", function () {
        
        var simpleObject = {
                a: "test",
                b: 1,
                c: 1.2,
                d: [{entry: 1},{entry: 2}],
                e: true,
                f: {
                    g: new Date(),
                    h: /ag/g
                }
            },
            clonedObject = clone(simpleObject);

        clonedObject.a.should.equal("test");
        clonedObject.b.should.equal(1);
        clonedObject.c.should.equal(1.2);
        clonedObject.d[1].entry.should.equal(2);
        clonedObject.e.should.equal(true);
        clonedObject.f.g.constructor.should.equal(Date);
        clonedObject.f.h.constructor.should.equal(RegExp);
        
    });

    it("Shallow circular reference", function () {
        
        var simpleObject = {
                a: {
                    b: {

                    }
                }
            },
            clonedObject;

        // Create a circular reference
        simpleObject.a.b = simpleObject.a;

        clonedObject = clone(simpleObject);

        clonedObject.a.b.should.equal(clonedObject.a);
        clonedObject.a.b.should.not.equal(simpleObject.a);
        
    });

    it("Circular reference", function () {
        
        var simpleObject = {
                a: 1,
                b: {
                    c: {
                        d: {
                            val: 2
                        }
                    }
                },
                d: 3
            },
            clonedObject;

        // Create a circular reference
        simpleObject.b.c.d.e = simpleObject.b;

        clonedObject = clone(simpleObject);

        // Test that the circular reference works
        clonedObject.b.c.d.e.should.equal(clonedObject.b);

        // Test that the reference to simpleObject is removed
        clonedObject.b.c.d.e.should.not.equal(simpleObject.b);

        // Test recursion into the circular reference
        clonedObject.b.c.d.e.c.d.val.should.equal(2);
        
    });

    it("Plain string", function () {
        
        var 
            simpleObject = "Hello",
            clonedObject;

        clonedObject = clone(simpleObject);

        // Check for equality
        clonedObject.should.equal("Hello");

        // Change cloned object, and check that the original didn't change
        clonedObject += "Yo";

        simpleObject.should.equal("Hello");
        clonedObject.should.equal("HelloYo");

    });

    it("Plain string in object", function () {
        
        var 
            simpleObject = { myString: "Hello" },
            clonedObject;

        clonedObject = clone(simpleObject);

        // Check for equality
        clonedObject.myString.should.equal("Hello");

        // Change cloned object, and check that the original didn't change
        clonedObject.myString += "Yo";

        simpleObject.myString.should.equal("Hello");
        clonedObject.myString.should.equal("HelloYo");

    });

    it("Plain number", function () {
        
        var 
            simpleObject = 42,
            clonedObject;

        clonedObject = clone(simpleObject);

        // Check for equality
        clonedObject.should.equal(42);

        // Change cloned object, and check that the original didn't change
        clonedObject += 1;

        simpleObject.should.equal(42);
        clonedObject.should.equal(43);

    });

    it("Plain number in object", function () {
        
        var 
            simpleObject = { myNumber: 42 },
            clonedObject;

        clonedObject = clone(simpleObject);

        // Check for equality
        clonedObject.myNumber.should.equal(42);

        // Change cloned object, and check that the original didn't change
        clonedObject.myNumber += 1;

        simpleObject.myNumber.should.equal(42);
        clonedObject.myNumber.should.equal(43);

    });

    it("Date", function () {
        
        var 
            simpleObject = new Date(),
            clonedObject;

        simpleObject.setSeconds(0);

        clonedObject = clone(simpleObject);

        // Change cloned object, and check that the original didn't change
        clonedObject.setSeconds(4);

        simpleObject.getSeconds().should.equal(0);
        clonedObject.getSeconds().should.equal(4);

    });

    it("Array with various objects", function () {
        
        var 
            simpleObject = [new Date(),1,"Hello",{ payload: 4 }, null, NaN, undefined],
            clonedObject;

        simpleObject[0].setSeconds(0);

        clonedObject = clone(simpleObject);

        clonedObject[1].should.equal(1);
        clonedObject[3].payload.should.equal(4);
        should.equal(clonedObject[4], null);
        clonedObject[5].should.not.equal(clonedObject[5]); // Check for NaN :)

        clonedObject[0].setSeconds(4);
        clonedObject[1] = 2;
        clonedObject[2] += "Hej";
        clonedObject[3].payload++;

        simpleObject[0].getSeconds().should.equal(0);
        simpleObject[1].should.equal(1);
        simpleObject[2].should.equal("Hello");
        simpleObject[3].payload.should.equal(4);

    });

    it("String object with custom property", function () {
        
        var mySuperString = new String("test"),
            clonedSuperString;

        // Woah
        mySuperString.mySubString = "subtest";

        clonedSuperString = clone(mySuperString);

        clonedSuperString.should.equal("test");
        //clonedSuperString.mySubString.should.equal("subtest");

        clonedSuperString.mySubString = "subchanged";
        //clonedSuperString.mySubString.should.equal("subchanged");

        mySuperString.should.equal("test");
        
        // ToDo! custom properties of for example new String()
        //       is lost in copying

         // mySuperString.mySubString.should.equal("subtest");

    });


});
