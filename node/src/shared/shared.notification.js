import * as utils from '../utils';
import {
  firebase
} from './shared.firebase';

export function send(registrationTokens, payload) {

  let logFuncName = 'send';

  utils.logData(`${logFuncName} registrationTokens: ${JSON.stringify(registrationTokens)}`, utils.LOGLEVELS.INFO);
  utils.logData(`${logFuncName} payload: ${JSON.stringify(payload)}`, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await firebase.messaging().sendToDevice(registrationTokens, {
        data: payload,
        notification: {
          title: payload.title,
          body: payload.body
        },
      }).then((response) => {
        utils.logData(`${logFuncName} firebase.messaging().sendToDevice: Success: ${JSON.stringify(response)}`, utils.LOGLEVELS.ERROR);
        resolve(response);
      }).catch((error) => {
        utils.logData(`${logFuncName} firebase.messaging().sendToDevice: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        resolve(null);
      });
      
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      resolve(null);
    }
  };

  return new Promise(executor);

}
