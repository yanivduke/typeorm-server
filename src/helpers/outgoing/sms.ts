

import { Logger } from "../../../winston";
import { configApp } from "../../../configApp";
import axios from 'axios';
import * as convert from 'xml-js';

if(!configApp.SMS) {
  Logger('error','"message": "${msg}"', 
    {
        msg: "missing sms message provider config: outgoing_message_providers.sms "
    });
  
}
var url = configApp.SMS.address;
var user_name = configApp.SMS.user_name;
var password = configApp.SMS.password;
var headers1:any  = {
  'Content-Type': 'application/xml',
  'charset':'utf-8',
}

async function send_sms(msg: any) {
  var authdata = xml_merge_auth(msg);
  var response1: any = await axios.post(url, authdata,{
    headers: headers1
  })

  var messagedata = xml_merge_message(msg);
  var resXml: convert.ElementCompact, statusDesc;
  var headers2: any = {
    'Content-Type': 'application/xml',
    'Cache-Control': 'no-cache',
    'Authorization': `Bearer ${response1.data.message}`
  }
  var response2: any = await axios.post(url, messagedata,{
    headers: headers2,
    
  })
  response2 || (response2 = {});//to skip error of null properites;
  if (response2.status == 200) {
    try {
      //parse the xml response
      //resXml = convert.xml2js(response2.body , {compact: true });
      if(response2.data.status == "0") {
        //everything is ok - resolve !!
        return Promise.resolve({status: 'ok'})
      }
      else {
        //there is a problem with the message from the supllier
        //read the hebrew translation to it based on dictionary bellow
        Logger('error','"message": "${msg}", "state: "${state}"', 
        {
            msg: 'sms response status error from sms server',
            state: JSON.stringify( {
              body: response2.body, 
              statusCode: response2.statusCode,
              statusDesc: statusDesc
            } )
        });
        
        return Promise.reject(new Error( statusDesc || 'bad response from sms server'));
      }
    }
    catch(e) {
      //enable to parse xml and read the answer
      Logger('error','"message": "${msg}", "state: "${state}"', 
      {
          msg: 'error parsing XML response from sms server',
          state: JSON.stringify( {
            body: response2.body, 
            statusCode: response2.statusCode,
          } )
      });
      
      return Promise.reject(new Error('bad response from sms server'));
    }
  }
  else {
    //response status code != 200 - network error 
    Logger('error','"message": "${msg}", "state: "${state}"', 
    {
        msg: 'bad response from sms server',
        state: JSON.stringify( {
          body: response2.body, 
          statusCode: response2.statusCode,
        } )
    });
    
    return Promise.reject(new Error('bad response from sms server: '+response2.statusCode));
  }
}


function xml_merge_auth(msg: any){
  return `<getApiToken>
    <user>
    <username>${user_name}</username>
    <password>${password}</password>
    </user>
    <username>${user_name}</username>
    <action>new</action>
    </getApiToken>`

}

function xml_merge_message(msg: any){
  return `<sms>
      <user>
        <username>${user_name}</username>
      </user>
      <source>${msg.from_address}</source>
      <destinations>
        <phone>${msg.to_address}</phone>
      </destinations>
      <message>${msg.content}</message>
    </sms>`
}


function get_sms_status_desc(code: string) {
  
  var sms_response_status_codes: any = {
    "1":   {eng: "OK                          ", heb: "תקין"},
    "-1":  {eng: "Failed                      ", heb: "נכשל"},
    "-2":  {eng: "Bad user name or password   ", heb: "משתמש או ססמה שגויים"},
    "-6":  {eng: "RecipientsDataNotExists     ", heb: "פרטי נמען לא קיימים"},
    "-9":  {eng: "MessageTextNotExists        ", heb: "טקסט הודעה חסר"},
    "-11": {eng: "IllegalXML                  ", heb: "xml לא תקין"},
    "-13": {eng: "UserQuotaExceeded           ", heb: "מכסת ההודעות למשתמש נגמרה"},
    "-14": {eng: "ProjectQuotaExceeded        ", heb: "מכסת ההודעות לפרויקט נגמרה"},
    "-15": {eng: "CustomerQuotaExceeded       ", heb: "מכסת הודעות ללקוח נגמרה"},
    "-16": {eng: "WrongDateTime               ", heb: "תאריך ושעה שגויים"},
    "-17": {eng: "WrongNumberParameter        ", heb: "פרמטר מספר שגוי"},
    "-18": {eng: "No valid recipients         ", heb: "נמען לא תקין"},
    "-20": {eng: "InvalidSenderNumber         ", heb: "מספר שולח לא תקין"},
    "-21": {eng: "InvalidSenderName,          ", heb: "שם שולח לא תקין"},
    "-22": {eng: "UserBlocked                 ", heb: "משתמש חסום"},
    "-26": {eng: "UserAuthenticationError     ", heb: "כניסה משתמש נכשלה"},
    "-28": {eng: "NetworkTypeNotSupported     ", heb: "סוג רשת לא מתמך"},
    "-29": {eng: "NotAllNetworkTypesSupported ", heb: "לא כל סוגי הרשתות נתמכים"},
    "-90": {eng: "InvalidSenderIdentification ", heb: "שולח לא מזוהה"}
  }
 return sms_response_status_codes[code].heb ;
}


async function send (msg: any) {
  return await send_sms(msg) ;
}

export default send;