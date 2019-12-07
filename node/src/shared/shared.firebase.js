import config from 'config';
import firebaseAdmin from 'firebase-admin';

import * as utils from '../utils';

const firebaseConfig = config.get('firebase');

// init the firebase admin
export const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    type: firebaseConfig.type,
    project_id: firebaseConfig.project_id,
    private_key_id: firebaseConfig.private_key_id,
    private_key: firebaseConfig.private_key.replace(/\\n/g, '\n'),
    client_email: firebaseConfig.client_email,
    client_id: firebaseConfig.client_id,
    auth_uri: firebaseConfig.auth_uri,
    token_uri: firebaseConfig.token_uri,
    auth_provider_x509_cert_url: firebaseConfig.auth_provider_x509_cert_url,
    client_x509_cert_url: firebaseConfig.client_x509_cert_url,
  }),
});

// Verify Firebase Id Token
export async function verifyIdToken(idToken) {

  let logFuncName = 'verifyIdToken';

  const executor = async function (resolve, reject) {
    try {

      const decodedToken = firebaseAdmin.auth().verifyIdToken(idToken);
      utils.logData(`${logFuncName} decodedToken : Result : ${JSON.stringify(decodedToken)}`, utils.LOGLEVELS.INFO);

      if (decodedToken) {

        utils.logData(`${logFuncName} firebaseAdmin.auth.verifyIdToken : Result : ${JSON.stringify(decodedToken)}`, utils.LOGLEVELS.INFO);
        resolve(decodedToken);

      } else {

        let msg = 'ERROR_OCCURED: VERIFY_ID_TOKEN';
        utils.logData(`${logFuncName} firebaseAdmin.auth.verifyIdToken : Error : ${msg}`, utils.LOGLEVELS.ERROR);
        reject(msg);

      }

    } catch (err) {
      let msg = 'ERROR_OCCURED: VERIFY_ID_TOKEN';
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}
