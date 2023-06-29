
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { Logger } from "../../../winston";
import { configApp } from "../../../configApp";

// API aws cli installation nedded - 1. npm install aws-sdk; 2. npm install aws-sdk;

var transport = nodemailer.createTransport(smtpTransport(configApp.EMAIL_SMTP));

var mailOptions = {
  from: configApp.EMAIL_SENDER, // sender address
  to: '', // list of receivers
  subject: '', // Subject line
  text: '', // plaintext body
  html: '' // html body
};

var send = (msg: any) => {
    //mailOptions.replay_to = msg.from_address;
    mailOptions.to = msg.to_address;
    mailOptions.subject = msg.subject;
    if(msg.isHTML){
        mailOptions.html = msg.content;
    }
    else{
        mailOptions.text = msg.content;
    }
    
    
    transport.sendMail(mailOptions, function(error, info) {
        if (error) {
            Logger('error','"message": "${msg}"', 
            {
                msg: "error sending an email" + error
            });
            return {status: "fail", error: error}
        }
        else{
            Logger('info','"message": "${msg}"', 
            {
                msg: JSON.stringify( info )
            });
            return {status: "ok", info: info}
        }
    });

}
export default send;
