/***********************************************************************************

    Abstractor | MSSQL module | MIT License | ©2016 Hexagon <github.com/hexagon>

    Communicate with a MSSQL server

    ----------------------------------------------------------------------------


    Dependencies

    mssql


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
    mssql = require("mssql");

class MSSQL extends Pipe {

    invoke(msg) {
        
        let self = this,
            connection; 

        // Sanity checks
        if ( !msg ) { self.trigger( "error", { error: "No message provided." } ); return; }
        if ( !msg.topic && !this.config.query  ) { msg.error = "No SQL Query provided, msg.topic should contain query."; self.trigger( "error", msg ); return; }
        if ( !self.config.credentials )  { self.trigger( "error", { error: "No credentials provided, mssql-node config should contain a credentials-object." } ); return;   }
        if ( !self.config.credentials.server )  { self.trigger( "error", { error: "No server provided, mssql-node config should contain host." } ); return; }
        if ( !self.config.credentials.user )  { self.trigger( "error", { error: "No user provided, mssql-node config should contain user." } ); return; }
        if ( !self.config.credentials.password )  { self.trigger( "error", { error: "No password provided, mssql-node config should contain password." } ); return; }
        if ( !self.config.credentials.database )  { self.trigger( "error", { error: "No database provided, mssql-node config should contain database." } ); return; }

        connection = new mssql.Connection(self.config.credentials, function (err) {

            if (err) {
                return self.error( msg, "MSSQL connection failed, please check your credentials and review the following error: " +err.stack);
            }

            var request = new mssql.Request(connection);
            request.query(self.config.query || msg.topic, function (err, data) {

                connection.close();

                if (err) {
                    return self.error( msg , "MSSQL query failed: " + err.stack);
                }

                msg.payload = data;
                self.trigger( "success", msg );

            });
        });

    }

}

module.exports = MSSQL;
