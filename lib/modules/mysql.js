/***********************************************************************************

    Abstractor | MySQL module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Communicate with a MySQL server

    ----------------------------------------------------------------------------


    Dependencies

    mysql


    ----------------------------------------------------------------------------


    Options

    ---------------------+-----------------+----------------------+-----------------
    Option               |  Type           |  Default             |  Mandatory
    ---------------------+-----------------+----------------------+-----------------
    credentials.server   |  string         |  undefined           |  yes
    credentials.database |  string         |  undefined           |  yes
    credentials.user     |  string         |  undefined           |  yes
    credentials.password |  string         |  undefined           |  yes
    query                |  string         |  undefined           |  no
    ----------------------------------------------------------------------------


    I/O

    -------------------------------+----------------------+---------------------
    Incoming property              |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
    <any message>                  |  success             |  payload
          OR                       +----------------------+---------------------
    topic: <sql string>            |  error               |  error
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const
    Pipe = require("../pipe.js"),
    mysql = require("mysql");

class MySQL extends Pipe {

    invoke(msg) {
        
        let self = this,
            connection; 

        // Sanity checks
        if ( !msg ) { self.trigger( "error", { error: "No message provided." } ); return; }
        if ( !msg.topic && !this.config.query ) { msg.error = "No SQL Query provided, msg.topic should contain query."; self.trigger( "error", msg ); return; }
        if ( !self.config.credentials )  { self.trigger( "error", { error: "No credentials provided, mysql-node config should contain a credentials object." } ); return;   }
        if ( !self.config.credentials.host )  { self.trigger( "error", { error: "No host provided, mysql-node config should contain host." } ); return; }
        if ( !self.config.credentials.user )  { self.trigger( "error", { error: "No user provided, mysql-node config should contain user." } ); return; }
        if ( !self.config.credentials.password )  { self.trigger( "error", { error: "No password provided, mysql-node config should contain password." } ); return; }
        if ( !self.config.credentials.database )  { self.trigger( "error", { error: "No database provided, mysql-node config should contain database." } ); return; }
            
        connection = mysql.createConnection( self.config.credentials );
        
        // Explicitly handle connection, to be able to handle errors
        connection.connect(function(err) {

            if (err) {
                return this.error( msg, "MySQL connection failed, " + err.stack);
            }

            // So far, so good. Run the query.
            connection.query(self.config.query || msg.topic, msg.parameters, function(err, rows) {

                // Instantly request a termination of connection
                connection.end();

                if (err) {
                    return self.error( msg, "MySQL query failed, " + err.stack );
                }

                msg.payload = rows;
                self.trigger( "success", msg );

            });

        });


    }

}

module.exports = MySQL;
