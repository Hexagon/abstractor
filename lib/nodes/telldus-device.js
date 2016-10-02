/***********************************************************************************

    Abstractor | Telldus Devices | MIT License | ©2016 Hexagon <github.com/hexagon>

    Listens for status changes, and sets status of a configured telldus device.


    ----------------------------------------------------------------------------


    Dependencies

    node-telldus


    ----------------------------------------------------------------------------


    Options

    One of these has to be set.

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    listen           |  boolean        |  false               |  no
    deviceId         |  string         |  undefined           |  no
    deviceAction     |  array <string> |  undefined           |  no
    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Output
    -------------------------------+----------------------+---------------------
    N/A                            |  received            |  topic
                                   |                      |  payload
    -------------------------------+----------------------+---------------------
    <any message>                  |  success             |  payload
                                   +----------------------+---------------------
                                   |  error               |  error
    -------------------------------+----------------------+---------------------

***********************************************************************************/


"use strict";

const
    Pipe = require("../pipe.js"),
    telldus = require("telldus");

class TelldusDevice extends Pipe {

    constructor(parameters) {
        super(parameters);

        if (this.config.listen) {
            // ToDo: Define self in base class instead of every single node
            var self = this,
                devices = {};
            
            telldus.getDevices(function(err, newDevices) {
                

                if ( err ) {

                    return this.error( {}, "Initialization failed, detDevices returned: " + err);

                } else {
                    
                    // Store all devices is a handy device-object
                    newDevices.forEach(function(device) {
                        devices["device_"+device.id] = device;
                    });

                    // Start event listener
                    telldus.addDeviceEventListener(function(deviceId, status) {

                        var message = {},
                            device = devices["device_"+deviceId];

                        if (device) {
                            device.status = {status: status.name};
                            message.topic = deviceId;
                            message.payload = device;
                            self.trigger ( "received", message);

                        } else {
                            return this.error( message, "Received message from unknown device (id: " + deviceId + "), ignoring.");

                        }

                    });

                }

            });

        }

    }

    invoke (msg) {

        var 
            self = this,
            
            deviceId,
            deviceAction,
            dimValue,
            
            validActions = ["turnOn","turnOff","dim"];

        // Set deviceId
        // config.deviceId or msg.deviceId is required
        if( (deviceId = this.getConfig("deviceId", msg) ) === undefined)  return;

        // Set action
        if( (deviceAction = this.getConfig("deviceAction", msg) ) === undefined)  return;

        // Check action
        if ( validActions.indexOf(deviceAction) === -1 ) return this.error ( msg , "Unsupported deviceAction: " + deviceAction);

        // Validate dim payload
        if (deviceAction == "dim") {
            if (msg.payload && !isNaN(parseInt(msg.payload))) {
                dimValue = parseInt(msg.payload);
            } else if (this.config.dimValue && !isNaN(parseInt(this.config.dimLevel))) {
                dimValue = parseInt(this.config.dimValue);
            } else {
                return this.error( msg, "Dim action require msg.topic or <node config>.dimLevel to be set to a integer value." + validActions.toString());
            }
        }

        if (deviceAction == "turnOn") {
            telldus.turnOn(deviceId, function (err) {
                if (err) {
                    return this.error( msg, "An error were raised while trying to" + deviceAction + " deviceId " + deviceId + ":" + validActions.toString());
                }
                msg.payload = true;
                self.trigger( "success", msg);  
            });
        } else if (deviceAction == "turnOff") {
            telldus.turnOff(deviceId, function (err) {
                if (err) {
                    return this.error( msg, "An error were raised while trying to" + deviceAction + " deviceId " + deviceId + ":" + validActions.toString());
                }
                msg.payload = true;
                self.trigger( "success", msg);  
            });
        } else {            
            telldus.dim(deviceId, dimValue, function(err) {
                if (err) {
                    return this.error(msg, "An error were raised while trying to" + deviceAction + " deviceId " + deviceId + " to " + dimValue + ":" + validActions.toString());
                }
                msg.payload = true;
                self.trigger( "success", msg);
            });
        }

    }
    
}

module.exports = TelldusDevice;