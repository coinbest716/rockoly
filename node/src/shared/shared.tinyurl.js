import * as utils from '../utils';

var tinyURL = require('tinyurl');

export async function makeUrlAsTinyUrl(url) {

  let logFuncName = 'makeUrlAsTinyUrl: ';

  utils.logData(`${logFuncName} url: ${url} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

        tinyURL.shorten(url).then(function(res) {
            utils.logData(`${logFuncName} tinyURL.shorten Success: ${res}`, utils.LOGLEVELS.INFO);
            resolve(res);
            console.log(res)
        }, function(err) {
            utils.logData(`${logFuncName} tinyURL.shorten Error: ${err}`, utils.LOGLEVELS.ERROR);
            reject(err);
        });

    } catch (err) {
      let msg = 'ERROR_OCCURED: makeUrlAsTinyUrl';
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

};