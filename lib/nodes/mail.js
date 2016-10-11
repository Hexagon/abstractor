/***********************************************************************************

    Abstractor | Mailer | MIT License | ©2016 Hexagon <github.com/hexagon>

    Sends mail using node mailer

    ----------------------------------------------------------------------------

    
    Dependencies

    nodemailer


    ----------------------------------------------------------------------------


    Options

    Options are passed as is to nodemailer, see: 

    https://github.com/nodemailer/nodemailer#set-up-smtp



    I/O

    -------------------------------+----------------------+---------------------
    Input                          |  Possible triggers   |  Sets property
    -------------------------------+----------------------+---------------------
                                   |  success             |  <none>
    payload: <string/buffer>       +----------------------+---------------------
                                   |  error               |  error
    -------------------------------+----------------------+---------------------


***********************************************************************************/

"use strict";

const
    Node = require("../node.js"),
    nodemailer = require("nodemailer");

class Mail extends Node {

    invoke(msg) {

        let self = this; 

        // Sanity checks
        if ( !msg ) { this.trigger( "error", { error: "No message provided." } ); return; }
        if ( !msg.fromName ) { this.trigger( "error", { error: "No from name provided." } ); return;    }
        if ( !msg.fromAddress ) { this.trigger( "error", { error: "No from address provided." } ); return;  }
        if ( !msg.to ) { this.trigger( "error", { error: "No to address provided." } ); return; }
        if ( !msg.subject ) { this.trigger( "error", { error: "No subject provided." } ); return;   }
        if ( !(msg.text || msg.html) ) { this.trigger( "error", { error: "No text or html provided." } ); return;   }

        var transporter = nodemailer.createTransport(this.config);

        var mailOptions = {
            from: "\"" + msg.fromName + "\" <" + msg.fromAddress + ">",
            to: msg.to, // comma-separated, if more than one
            subject: msg.subject,
            text: msg.text,
            html: msg.html
        };

        // objects are stringified and sent as application/json, strings and things that can be converted to strings are sent with text/play, everything else respons with 500
        if(typeof mailOptions.text == "object") {
            mailOptions.text = JSON.stringify(mailOptions.text);
        } else if (typeof mailOptions.text == "string") {
            mailOptions.text = mailOptions.text;
        } else if (mailOptions.text && mailOptions.text.toString && typeof mailOptions.text != "function") {
            mailOptions.text = mailOptions.text.toString();
        }

        if(typeof mailOptions.html == "object") {
            mailOptions.html = JSON.stringify(mailOptions.html);
        } else if (typeof mailOptions.html == "string") {
            mailOptions.html = mailOptions.html;
        } else if (mailOptions.html && mailOptions.html.toString && typeof mailOptions.html != "function") {
            mailOptions.html = mailOptions.html.toString();
        }

        // send mail with defined transport object 
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                msg.error = error;
                self.trigger("error", msg);
                return;
            }
            msg.payload = info;
            self.trigger("success", msg);
        });

    }

}

module.exports = Mail;