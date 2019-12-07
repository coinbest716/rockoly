import * as utils from '../../../utils';
import * as shared from '../../../shared';

let logFileName = 'src/services/graphql/resolvers/resolvers.query.js: ';

const queryResolvers = {

  // get customer details present in stripe
  async stripeGetCustomerDetails(_, args, context) {

    let logFuncName = 'stripeGetCustomerDetails';

    try {

      // Check if user is blocked in every request
      let isBlocked = await utils.isBlocked(context.headers);
      if (isBlocked) {
        throw new Error('USER_IS_BLOCKED');
      }

      let isAuthorized = await utils.isAuthorized(context);

      utils.logData(`${logFileName}${logFuncName} isAuthorized: ${isAuthorized}`, utils.LOGLEVELS.INFO);

      if (!isAuthorized) {

        throw new Error('UNAUTHORIZED');

      } else {

        utils.logData(`${logFileName}${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

        let customerId = args.customerId;

        return await shared.stripe.customerDetailsById(customerId).then(async function (res) {

          utils.logData(`${logFileName}${logFuncName} Res: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

          return {
            data: res
          };

        }).catch(function (error) {
          utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);
        });

      }
    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  // get cards
  async stripeGetCustomerCards(_, args, context) {
    let logFuncName = 'stripeGetCustomerCards';

    try {

      // Check if user is blocked in every request
      let isBlocked = await utils.isBlocked(context.headers);
      if (isBlocked) {
        throw new Error('USER_IS_BLOCKED');
      }

      let isAuthorized = await utils.isAuthorized(context);

      utils.logData(`${logFileName}${logFuncName} isAuthorized: ${isAuthorized}`, utils.LOGLEVELS.INFO);

      if (!isAuthorized) {

        throw new Error('UNAUTHORIZED');

      } else {

        utils.logData(`${logFileName}${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

        let customerId = args.customerId;
        let limit = args.limit;

        return await shared.stripe.customerCards(customerId, limit).then(async function (res) {

          utils.logData(`${logFileName}${logFuncName} Res: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

          return {
            data: res
          };

        }).catch(function (error) {
          utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);
        });

      }

    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }
  },

  // get card details
  async stripeGetCardDetails(_, args, context) {
    let logFuncName = 'stripeGetCardDetails';

    try {

      // Check if user is blocked in every request
      let isBlocked = await utils.isBlocked(context.headers);
      if (isBlocked) {
        throw new Error('USER_IS_BLOCKED');
      }

      let isAuthorized = await utils.isAuthorized(context);

      utils.logData(`${logFileName}${logFuncName} isAuthorized: ${isAuthorized}`, utils.LOGLEVELS.INFO);

      if (!isAuthorized) {

        throw new Error('UNAUTHORIZED');

      } else {

        utils.logData(`${logFileName}${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

        let customerId = args.customerId;
        let cardId = args.cardId;

        return await shared.stripe.cardDetails(customerId, cardId).then(async function (res) {

          utils.logData(`${logFileName}${logFuncName} Res: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

          return {
            data: res
          };

        }).catch(function (error) {
          utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);
        });
      }

    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }
  },

  // get account details
  async stripeGetAccountDetails(_, args, context) {

    let logFuncName = 'stripeGetAccountDetails';

    try {

      // Check if user is blocked in every request
      let isBlocked = await utils.isBlocked(context.headers);
      if (isBlocked) {
        throw new Error('USER_IS_BLOCKED');
      }

      let isAuthorized = await utils.isAuthorized(context);

      utils.logData(`${logFileName} ${logFuncName} isAuthorized: ${isAuthorized}`, utils.LOGLEVELS.INFO);

      if (!isAuthorized) {

        throw new Error('UNAUTHORIZED');

      } else {

        utils.logData(`${logFileName} ${logFuncName} args: ${args}`, utils.LOGLEVELS.INFO);

        return await shared.stripe.accountDetailsById(args.accountId).then(async function (accountDetailsRes) {

          utils.logData(`${logFileName} ${logFuncName} shared.stripe.accountDetailsById Res: ${JSON.stringify(accountDetailsRes)}`, utils.LOGLEVELS.INFO);

          return {
            data: accountDetailsRes
          };

        }).catch(function (error) {

          utils.logData(`${logFileName} ${logFuncName} shared.stripe.accountDetailsById Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);

        });

      }

    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }
  },

  // get chef account details
  async stripeGetChefAccounts(_, args, context) {

    let logFuncName = 'stripeGetChefAccounts';

    let backDetailsAsArr = [];
    let i = 0;

    try {

      // Check if user is blocked in every request
      let isBlocked = await utils.isBlocked(context.headers);
      if (isBlocked) {
        throw new Error('USER_IS_BLOCKED');
      }

      let isAuthorized = await utils.isAuthorized(context);

      utils.logData(`${logFileName} ${logFuncName} isAuthorized: ${isAuthorized}`, utils.LOGLEVELS.INFO);

      if (!isAuthorized) {

        throw new Error('UNAUTHORIZED');

      } else {

        utils.logData(`${logFileName} ${logFuncName} args: ${args}`, utils.LOGLEVELS.INFO);

        // get account id
        return await shared.db.getChefBankDetails(args.chefId).then(async function (res) {

          utils.logData(`${logFuncName} shared.db.getChefBankDetails Result: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

          if (res.hasOwnProperty('chef_bank_details')) {
            if (res.chef_bank_details.length != 0) {

              // loop throught all records
              while (i < res.chef_bank_details.length) {

                // get account details
                let bankDetails = await shared.stripe.accountDetailsById(res.chef_bank_details[i].chef_stripe_user_id).then(async function (accountDetailsRes) {
                  utils.logData(`${logFileName} ${logFuncName} shared.stripe.accountDetailsById Res: ${JSON.stringify(accountDetailsRes)}`, utils.LOGLEVELS.INFO);
                  return accountDetailsRes;
                }).catch(function (error) {
                  utils.logData(`${logFileName} ${logFuncName} shared.stripe.accountDetailsById Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
                  return [];
                });

                backDetailsAsArr.push({
                  'chef_stripe_user_id': res.chef_bank_details[i].chef_stripe_user_id,
                  'chef_id': res.chef_bank_details[i].chef_id,
                  'chef_bank_profile_id': res.chef_bank_details[i].chef_bank_profile_id,
                  'is_default_yn': res.chef_bank_details[i].is_default_yn,
                  'bank_details': bankDetails
                });

                i++;
              }

              if (i == res.chef_bank_details.length) {
                return {
                  data: backDetailsAsArr
                };
              }

            } else {
              return {
                data: backDetailsAsArr
              };
            }
          } else {
            return {
              data: backDetailsAsArr
            };
          }

        }).catch(function (error) {
          utils.logData(`${logFuncName} shared.db.getChefBankDetails Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        });

      }

    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }
  },

};

export {
  queryResolvers
};
