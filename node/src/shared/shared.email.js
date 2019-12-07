import config from 'config';
import nodemailer from 'nodemailer';

const emailConfig = config.get('email');
import * as utils from '../utils';

var transporter = nodemailer.createTransport(emailConfig);

// Send
export async function send(emailPayload) {

  let logFuncName = 'sendEmail: ';

  utils.logData(`${logFuncName} emailPayload : ${JSON.stringify(emailPayload)}`, utils.LOGLEVELS.INFO);

  var mailOptions = {
    to: emailPayload.toEmail,
    subject: emailPayload.subject,
    text: emailPayload.message
  };

  const executor = async function (resolve, reject) {
    try {

      utils.logData(`${logFuncName} MailOptions : ${JSON.stringify(mailOptions)}`, utils.LOGLEVELS.INFO);

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          let msg = 'ERROR_OCCURED: SEND EMAIL';
          utils.logData(`${logFuncName} transporter.sendMail Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          reject(msg);

        } else {
          utils.logData(`${logFuncName} transporter.sendMail Success: ${JSON.stringify(info)}`, utils.LOGLEVELS.INFO);
          resolve(info);
        }
      });

    } catch (err) {
      let msg = 'ERROR_OCCURED: SEND_EMAIL';
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}
