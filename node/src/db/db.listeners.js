import * as utils from '../utils';
import * as shared from '../shared';

export async function dbListeners(notification) {
  let logName = 'dbListeners';

  try {

    // stringify the payload
    let payload = JSON.parse(notification.payload);

    utils.logData(`${logName}: payload: ${JSON.stringify(payload)}`, utils.LOGLEVELS.INFO);

    // Subscription
    // check if notificationTableName is present or not
    if (payload.notification_table_name) {

      // make the notificationTableName camelcase
      let notificationChannelName = utils.convertStringToCamelCase(payload.notification_table_name);

      utils.logData(`${logName}: notificationChannelName: ${notificationChannelName}`, utils.LOGLEVELS.INFO);

      // set the payload in
      let data = {};
      let newData = utils.convertObjectKeysToCamelCase(payload.notification_table_row_as_json);

      data[notificationChannelName] = {
        data: newData
      };

      utils.logData(`${logName}: data: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);

      // publish the data
      if (global.pubsub) {
        global.pubsub.publish(notificationChannelName, data);
      }
    }

    // Send Email
    if (payload.notification_channel == 'send_email') {

      let data = payload.notification_table_row_as_json;

      let emailData = {
        toEmail: data.email,
        subject: data.subject,
        message: data.message
      };

      shared.email.send(emailData).then(async function (res) {
        utils.logData(`${logName} SEND_EMAIL: Res: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);
      }).catch(function (error) {
        utils.logData(`${logName} SEND_EMAIL: Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      });

    }

    // Send SMS
    if (payload.notification_channel == 'send_sms') {

      let data = payload.notification_table_row_as_json;
      let message =  data.message;
      let formatedMsg = '';
      let newLink = '';
      let link = data.link;

      if(data.hasOwnProperty('link')){
        if(data.link != null && data.link != ''){
          newLink = await shared.tinyurl.makeUrlAsTinyUrl(link);
          formatedMsg = message.replace('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',newLink);
        }else{
          formatedMsg = message;
        }
      }else{
        formatedMsg = message;
      }
      
      utils.logData(`${logName} SEND_SMS: PhoneNo: ${data.phoneNo}`, utils.LOGLEVELS.INFO);
      utils.logData(`${logName} SEND_SMS: Message: ${formatedMsg}`, utils.LOGLEVELS.INFO);

      shared.sms.send(data.phoneNo, formatedMsg).then(async function (res) {
        utils.logData(`${logName} SEND_SMS: Res: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);
      }).catch(function (error) {
        utils.logData(`${logName} SEND_SMS: Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      });

    }

    // Send Notification
    if (payload.notification_channel == 'send_notification') {

      let data = payload.notification_table_row_as_json;

      // Get device token
      shared.db.getDeviceToken(data.userId).then(async function (res) {
        utils.logData(`${logName} shared.db.getDeviceToken Result Length: ${res.device_token.length}`, utils.LOGLEVELS.INFO);

        // Send Notification:
        if (res.device_token.length != 0) {
          shared.notification.send(res.device_token, data).then(async function (res) {
            utils.logData(`${logName} shared.notification.send Result: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);
          }).catch(function (error) {
            utils.logData(`${logName} shared.notification.send Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          });
        }

      }).catch(function (error) {
        utils.logData(`${logName} shared.db.getDeviceToken Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      });

    }

  } catch (error) {
    utils.logData(`${logName}: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.INFO);
  }
}
