import * as utils from './util.log';
import * as shared from '../shared';

// isAuthorized
export async function isAuthorized(context) {

  let logFuncName = 'isAuthorized';
  let contextData = context.headers;

  // if no token is passed
  if (!contextData.token) {

    utils.logData(`${logFuncName} UNAUTHORIZED`, utils.LOGLEVELS.ERROR);
    return false;

  } else {

    // if token passed
    let token = contextData.token;

    // decode the firebase token
    return await shared.firebase.verifyIdToken(token).then(async function (res) {

      if (res.user_id) {
        return true;
      } else {
        return false;
      }

    }).catch(function (error) {

      utils.logData(`${logFuncName} shared.firebase.verifyIdToken Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      return false;

    });

  }
}

// isBlocked
export async function isBlocked(headers) {

  let logFuncName = 'isBlocked';
  let contextHeadersData = headers;

  // if no token is passed
  if (contextHeadersData.role && contextHeadersData.id) {

    return await shared.db.checkIfUserBlocked(contextHeadersData.id, contextHeadersData.role).then(async function (checkIfUserBlockedRes) {

      utils.logData(`${logFuncName} shared.db.checkIfUserBlocked Res: ${JSON.stringify(checkIfUserBlockedRes)}`, utils.LOGLEVELS.INFO);

      return checkIfUserBlockedRes.check_if_user_blocked;

    }).catch(function (error) {

      utils.logData(`${logFuncName} shared.db.checkIfUserBlocked Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      return false;

    });

  } else {
    return false;
  }
}

// Decode Header Token
export async function decodeHeaderToken(context) {

  let logFuncName = 'decodeHeaderToken';
  let contextData = context.headers;

  // if no token is passed
  if (contextData.token) {

    // if token passed
    let token = contextData.token;

    // decode the firebase token
    return await shared.firebase.verifyIdToken(token).then(async function (res) {

      utils.logData(`${logFuncName} Result: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);
      return res;

    }).catch(function (error) {

      utils.logData(`${logFuncName} shared.firebase.verifyIdToken Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      return {};

    });

  } else {
    return {};
  }
}
