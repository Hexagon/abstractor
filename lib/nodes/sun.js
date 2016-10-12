/***********************************************************************************

    Abstractor | Suncalc | MIT License | ©2016 Hexagon <github.com/hexagon>

    Emits a message on sun events.

    Possible triggers:
     * sunrise
     * sunset
     * dusk
     * night
     * dawn

    ----------------------------------------------------------------------------


    Dependencies

    suncalc (included by default)


    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    latitude         |  float          |  undefined           |  yes
    longitude        |  float          |  undefined           |  yes
    message          |  object         |  {}                  |  no
    -----------------+-----------------+----------------------+-----------------


    I/O

    -----------------------------+----------------------+-----------------------
    Input                        |  Triggers            |  Output
    -----------------------------+----------------------+-----------------------
    N/A                          |  sunrise             |  <configured messge>
    N/A                          |  sunset              |  <configured messge>
    N/A                          |  dusk                |  <configured messge>
    N/A                          |  night               |  <configured messge>
    N/A                          |  dawn                |  <configured messge>
    -----------------------------+----------------------+-----------------------


***********************************************************************************/

"use strict";

const
    Node = require("../node.js"),
    SunCalc = require("suncalc"),
    extend = require("util")._extend;


class Sun extends Node {

    nextEvent(event, current) {
        
        let self = this,
            upcomingEvent,
            now = new Date();

        // Make current optional
        current = current ? current : now;

        upcomingEvent = SunCalc.getTimes(new Date(current), this.config.latitude, this.config.longitude)[event];

        // If this event has already passed, get the same event of next day. Add five seconds as a safety precaution
        if (upcomingEvent.getTime() < now.getTime() + 5000 ) {
            return self.nextEvent(event, new Date(current.getTime() + 86400*1000));
        }

        // Schedule a trigger
        setTimeout(function () {
            // Trigger with a copy of configured message
            self.trigger( event, extend( {} , self.config.message ) );
            self.nextEvent(event, upcomingEvent);
        }, upcomingEvent.getTime() - now.getTime());


    }

    constructor(parameters) {
        
        var defaults = {
            message: {}
        };

        super(parameters, defaults);

        var self = this,
            events = [
                "sunrise",
                "sunset",
                "dusk",
                "night",
                "dawn"
            ];

        // Check for mandatory parameters
        if ( this.config.latitude === undefined ) {
            return self.throw( this.config.message , "Suncalc requires latitude" );
        }
        if ( this.config.longitude === undefined ) {
            return self.throw( this.config.message , "Suncalc requires longitude" );
        }

        // Schedule each event
        events.forEach(function(event) {
            self.nextEvent(event);
        });

    }

}

module.exports = Sun;