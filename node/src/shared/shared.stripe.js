import config from 'config';
import * as utils from '../utils';
import requestPromise from 'request-promise';

const stripeConfig = config.get('stripe');
const stripe = require('stripe')(stripeConfig.secretKey);

// customer details by id
export function customerDetailsById(customerId) {

  let logFuncName = 'customerDetailsById';

  utils.logData(`${logFuncName} customerId: ${customerId}`, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {
      await stripe.customers.retrieve(customerId, function (error, result) {

        utils.logData(`${logFuncName} stripe.customers.retrieve: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.customers.retrieve: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// get all card associated with customer
export function customerCards(customerId, limit) {

  let logFuncName = 'customerCards';

  utils.logData(`${logFuncName} customerId: ${customerId} , Limit: ${limit} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.customers.listSources(customerId, {
        limit: limit,
      }, function (error, result) {

        utils.logData(`${logFuncName} stripe.customers.listSources: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.customers.listSources: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// get card details
export function cardDetails(customerId, cardId) {

  let logFuncName = 'cardDetails';

  utils.logData(`${logFuncName} customerId: ${customerId}, cardId: ${cardId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.customers.retrieveSource(customerId, cardId, function (error, result) {

        utils.logData(`${logFuncName} stripe.customers.retrieveSource: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.customers.retrieveSource: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// create customer
export function createCustomer(payload, metaPayload) {

  let logFuncName = 'createCustomer';
  utils.logData(`${logFuncName} Payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);
  utils.logData(`${logFuncName} metaPayload: ${JSON.stringify(metaPayload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.customers.create({
        name: payload.name,
        email: payload.email,
        metadata: metaPayload
      }, async function (error, result) {

        utils.logData(`${logFuncName} stripe.customers.create: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.customers.create: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// create card
export function createCard(payload, metaPayload) {

  let logFuncName = 'createCard';
  utils.logData(`${logFuncName} Payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);
  utils.logData(`${logFuncName} metaPayload: ${JSON.stringify(metaPayload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.customers.createSource(payload.customerId, {
          source: payload.cardToken,
          metadata: metaPayload
        },
        function (error, result) {

          utils.logData(`${logFuncName} stripe.customers.createSource: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          utils.logData(`${logFuncName} stripe.customers.createSource: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

          if (error) {
            reject(error.code);
          } else {
            resolve(result);
          }

        });

    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// remove card
export function removeCard(customerId, cardId) {

  let logFuncName = 'removeCard';
  utils.logData(`${logFuncName} customerId: ${customerId}, cardId: ${cardId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.customers.deleteSource(customerId, cardId, function (error, result) {

        utils.logData(`${logFuncName} stripe.customers.deleteSource: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.customers.deleteSource: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// edit card
export function editCard(payload) {

  let logFuncName = 'editCard';
  utils.logData(`${logFuncName} Payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.customers.updateSource(payload.customerId, payload.cardId, {
        name: payload.name,
        address_city: payload.addressCity,
        address_country: payload.addressCountry,
        address_line1: payload.addressLine1,
        address_line2: payload.addressLine2,
        address_state: payload.addressState,
        address_zip: payload.addressZip,
        exp_month: payload.expMonth,
        exp_year: payload.expYear
      }, function (error, result) {

        utils.logData(`${logFuncName} stripe.customers.updateSource: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.customers.updateSource: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// charge
export function chargeCard(payload, bookingPayload) {

  let logFuncName = 'chargeCard';
  utils.logData(`${logFuncName} Payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);
  utils.logData(`${logFuncName} bookingPayload: ${JSON.stringify(bookingPayload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.charges.create({
        amount: payload.price,
        currency: payload.currency,
        customer: payload.stripeCustomerId,
        source: payload.cardId,
        metadata: bookingPayload
      }, async function (error, result) {

        utils.logData(`${logFuncName} stripe.charges.create: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.charges.create: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// refund amt
export function refundAmt(chargeId, amount, currency, metaPayload) {

  let logFuncName = 'refundAmt';

  utils.logData(`${logFuncName} chargeId: ${chargeId} , amount: ${amount}`, utils.LOGLEVELS.INFO);
  utils.logData(`${logFuncName} metaPayload: ${JSON.stringify(metaPayload)}`, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.refunds.create({
        charge: chargeId
      }, function (error, result) {

        utils.logData(`${logFuncName} stripe.refunds.create: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.refunds.create: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });

    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// transfer amt
export function transferAmt(amt, currency, destinationAccount, metaPayload) {

  let logFuncName = 'transferAmt';

  utils.logData(`${logFuncName} amt: ${amt}, currency: ${currency} , destinationAccount: ${destinationAccount}`, utils.LOGLEVELS.INFO);
  utils.logData(`${logFuncName} metaPayload: ${JSON.stringify(metaPayload)}`, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.transfers.create({
        amount: amt,
        currency: currency,
        destination: destinationAccount,
        metadata: metaPayload
      }, function (error, result) {

        utils.logData(`${logFuncName} stripe.transfers.create: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.transfers.create: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });

    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// retrieve balance amt
export function retrieveBalanceAmt() {

  let logFuncName = 'retrieveBalanceAmt';

  const executor = async function (resolve, reject) {
    try {

      await stripe.balance.retrieve(function (error, result) {

        utils.logData(`${logFuncName} stripe.balance.retrieve: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.balance.retrieve: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });

    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// authToken
export function authToken(token) {

  let logFuncName = 'authToken';

  utils.logData(`${logFuncName} token: ${token}`, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let options = {
        method: 'POST',
        uri: stripeConfig.authTokenUrl,
        body: {
          'client_secret': stripeConfig.secretKey,
          'code': token,
          'grant_type': 'authorization_code'
        },
        json: true
      };

      utils.logData(`${logFuncName} options: ${JSON.stringify(options)}`, utils.LOGLEVELS.INFO);

      return requestPromise(options).then(function (res) {
          utils.logData(`${logFuncName} Request Res: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);
          resolve(res);
        })
        .catch(function (err) {
          utils.logData(`${logFuncName} Request Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);

          if (err.hasOwnProperty('error')) {
            if (err.error.hasOwnProperty('error')) {
              reject(err.error.error);
            } else {
              reject('400');
            }
          } else {
            reject('400');
          }
        });

    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// get account details
export function accountDetailsById(id) {

  let logFuncName = 'accountDetailsById';

  utils.logData(`${logFuncName} id: ${id} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.accounts.retrieve(id, async function (error, result) {

        utils.logData(`${logFuncName} stripe.accounts.retrieve: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.accounts.retrieve: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}

// remove account
export function removeAccount(accountId) {

  let logFuncName = 'removeAccount';
  utils.logData(`${logFuncName} accountId: ${accountId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await stripe.accounts.del(accountId, function (error, result) {

        utils.logData(`${logFuncName} stripe.accounts.del: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        utils.logData(`${logFuncName} stripe.accounts.del: Result: ${JSON.stringify(result)}`, utils.LOGLEVELS.INFO);

        if (error) {
          reject(error.code);
        } else {
          resolve(result);
        }

      });
    } catch (err) {
      let msg = `ERROR_OCCURED: ${logFuncName} `;
      utils.logData(`${logFuncName} Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
      reject(msg);
    }
  };

  return new Promise(executor);

}
