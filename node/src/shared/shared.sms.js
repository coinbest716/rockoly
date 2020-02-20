import config from 'config';

import * as utils from '../utils';

let smsConfig = config.get('sms');

const accountSid = `${smsConfig.accountSid}`;
const authToken = `${smsConfig.authToken}`;

const client = require('twilio')(accountSid, authToken);

export async function send(toPhoneNumber, toMessage) {

  let logFuncName = 'sendSMS: ';

  utils.logData(`${logFuncName} sendSMSTo toPhoneNumber : ${toPhoneNumber}, toMessage : ${toMessage}`, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      client.messages
        .create({
          body: toMessage,
          from: `${smsConfig.fromNo}`,
          to: toPhoneNumber
        })
        .then((message) => {
          utils.logData(`${logFuncName} client.messages Success: ${JSON.stringify(message)}`, utils.LOGLEVELS.INFO);
          resolve(message);
        }).catch((err) => {
          let msg = 'ERROR_OCCURED: SEND SMS';
          utils.logData(`${logFuncName} client.messages Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
          reject(msg);
        });

    } catch (err) {
      let msg = 'ERROR_OCCURED: SEND SMS';
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

};