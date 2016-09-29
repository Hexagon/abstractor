/***********************************************************************************

    Abstractor | Exec module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Executes a command, returns exit code, stdout and stderr.

    ----------------------------------------------------------------------------


    Dependencies

    None


    ----------------------------------------------------------------------------


    Options

    -----------------+-----------------+----------------------+-----------------
    Option           |  Type           |  Default             |  Mandatory
    -----------------+-----------------+----------------------+-----------------
    command          |  string         |  undefined           |  yes
    -----------------+-----------------+----------------------+-----------------



    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Input                          |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
    N/A                            |                      |  payload (stdout)
                                   |  success             |  stdout
                                   |                      |  stderr
                                   +----------------------+---------------------
                                   |                      |  payload (stdout)
                                   |  error               |  stdout
                                   |                      |  stderr
                                   |                      |  error
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const
    Pipe = require("../pipe.js"),
    exec = require("child_process").exec;

class Exec extends Pipe {

    invoke(msg) {

        var command,
            self = this;
        
        // config.command or msg.command is required
        if( (command = this.getConfig("command", msg) ) === undefined) return;

        exec(command, (error, stdout, stderr) => {

            if (error) {
                msg.error = "Command exited with code " + error.code + ", signal " + error.signal + ".";
                msg.payload = msg.stdout = stdout;
                msg.stderr = stderr;
                self.trigger( "error", msg);

            } else {
                msg.payload = msg.stdout = stdout;
                msg.stderr = stderr;
                self.trigger( "success", msg);

            }

        });

    }

}

module.exports = Exec;