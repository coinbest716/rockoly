import * as utils from '../../../utils';
import * as shared from '../../../shared';

let logFileName = 'src/services/graphql/resolvers/resolvers.mutation.js: ';

const mutationResolvers = {

  // Create a Stripe Card
  async stripeAttachCardToCustomer(_, args, context) {

    let logFuncName = 'stripeAttachCardToCustomer';

    try {

      // Check if user is blocked in every request
      let isBlocked = await utils.isBlocked(context.headers);
      if (isBlocked) {
        throw new Error('USER_IS_BLOCKED');
      }

      // 0: Check if authorized
      let isAuthorized = await utils.isAuthorized(context);

      utils.logData(`${logFileName}${logFuncName} isAuthorized: ${isAuthorized}`, utils.LOGLEVELS.INFO);

      if (!isAuthorized) {

        throw new Error('UNAUTHORIZED');

      } else {

        utils.logData(`${logFileName}${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

        let customerId = args.customerId;
        let cardToken = args.cardToken;
        let email = args.email;

        // if customerId is not there, then create customer and then create a card
        if (!customerId) {

          // 1: Decode the token
          let tokenDetails = await utils.decodeHeaderToken(context);
          utils.logData(`${logFileName}${logFuncName} tokenDetails: ${JSON.stringify(tokenDetails)}`, utils.LOGLEVELS.INFO);

          // 2: Create a customer using token
          let customerPayload = {};
          if (tokenDetails.hasOwnProperty('name')) {
            customerPayload.name = tokenDetails.name;
          } else {
            customerPayload.name = '';
          }

          if (tokenDetails.hasOwnProperty('email')) {
            customerPayload.email = tokenDetails.email;
          } else {
            if (email) {
              customerPayload.email = email;
            } else {
              throw Error('EMAIL_IS_REQUIRED');
            }
          }

          return await shared.stripe.createCustomer(customerPayload, args).then(async function (createCustomerResponse) {

            utils.logData(`${logFileName}${logFuncName} shared.stripe.createCustomer Res: ${JSON.stringify(createCustomerResponse)}`, utils.LOGLEVELS.INFO);

            // 3: Create a card
            let cardPayload = {
              customerId: createCustomerResponse.id,
              cardToken: cardToken
            };

            return await shared.stripe.createCard(cardPayload, args).then(async function (createCardResponse) {

              utils.logData(`${logFileName}${logFuncName} shared.stripe.createCard: ${JSON.stringify(createCardResponse)}`, utils.LOGLEVELS.INFO);

              // update the customer id in tables
              let updatestripeCustomerPayload = {
                email: customerPayload.email,
                stripeCustomerId: createCustomerResponse.id
              };

              await shared.db.updateStripeCustomerId(updatestripeCustomerPayload).then(async function (res) {
                utils.logData(`${logFuncName} shared.db.updateStripeCustomerId Res: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);
              }).catch(function (error) {
                utils.logData(`${logFuncName} shared.db.updateStripeCustomerId Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
              });

              return {
                data: createCardResponse
              };

            }).catch(function (createCardError) {

              utils.logData(`${logFileName}${logFuncName} shared.stripe.createCard: Catch Error: ${JSON.stringify(createCardError)}`, utils.LOGLEVELS.ERROR);
              throw Error(createCardError);

            });

          }).catch(function (createCustomerError) {

            utils.logData(`${logFileName}${logFuncName} shared.stripe.createCustomer: Catch Error: ${JSON.stringify(createCustomerError)}`, utils.LOGLEVELS.ERROR);
            throw Error(createCustomerError);

          });

        } else {

          // 1: Create a card
          let cardPayload = {
            customerId: customerId,
            cardToken: cardToken
          };

          return await shared.stripe.createCard(cardPayload, args).then(async function (createCardResponse) {

            utils.logData(`${logFileName}${logFuncName} shared.stripe.createCard: ${JSON.stringify(createCardResponse)}`, utils.LOGLEVELS.INFO);

            return {
              data: createCardResponse
            };

          }).catch(function (createCardError) {

            utils.logData(`${logFileName}${logFuncName} shared.stripe.createCard: Catch Error: ${JSON.stringify(createCardError)}`, utils.LOGLEVELS.ERROR);
            throw Error(createCardError);

          });

        }

      }

    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  // Remove a Stripe Card
  async stripeRemoveCard(_, args, context) {

    let logFuncName = 'stripeRemoveCard';

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
        utils.logData(`${logFileName}${logFuncName} args: ${args}`, utils.LOGLEVELS.INFO);

        let customerId = args.customerId;
        let cardId = args.cardId;

        return await shared.stripe.removeCard(customerId, cardId).then(async function (res) {

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

  // Make booking complete
  async bookingComplete(_, args, context) {

    let logFuncName = 'bookingComplete';

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

        utils.logData(`${logFileName} ${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

        if (!args.hasOwnProperty('adminId')) {
          args['adminId'] = null;
        } else if (args.adminId == '') {
          args['adminId'] = null;
        }

        // 1: Make Booking Complete Manually
        return await shared.db.updateBookingStatus(args.bookingHistId, 'COMPLETED').then(async function (updateBookingStatusRes) {

          utils.logData(`${logFileName} ${logFuncName} shared.db.updateBookingStatus Res: ${JSON.stringify(updateBookingStatusRes)}`, utils.LOGLEVELS.INFO);

          // 2: Transfer amnt to chef
          // 21st december 2019: Admin will transfer amount to chef from admin dashboard
          /*
          return await transferBookingAmnt(args).then(async function (transferBookingAmntRes) {
            utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Success: ${JSON.stringify(transferBookingAmntRes)}`, utils.LOGLEVELS.INFO);

            // get booking records
            let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

            return {
              data: bookingData,
            };

          }).catch(async function (err) {

            utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);

            // get booking records
            let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

            return {
              data: bookingData,
            };

          });*/

          // get booking records
          let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

          return {
            data: bookingData,
          };

        }).catch(function (error) {

          utils.logData(`${logFileName}${logFuncName} shared.db.updateBookingStatus Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);

        });

      }
    } catch (error) {
      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  // Transfer amt
  async stripeTransferAmt(_, args, context) {

    let logFuncName = 'stripeTransferAmt';

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

        utils.logData(`${logFileName} ${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

        if (!args.hasOwnProperty('adminId')) {
          args['adminId'] = null;
        } else if (args.adminId == '') {
          args['adminId'] = null;
        }

        return await transferBookingAmnt(args).then(transferBookingAmntRes => {
          utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Success: ${JSON.stringify(transferBookingAmntRes)}`, utils.LOGLEVELS.INFO);

          return {
            data: transferBookingAmntRes,
          };

        }).catch(err => {

          utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
          throw Error(err);

        });

      }
    } catch (error) {
      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  // Transfer amt
  async stripeTransferAmtTest(_, args, context) {

    let logFuncName = 'stripeTransferAmtTest';

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

        utils.logData(`${logFileName} ${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

        if (!args.hasOwnProperty('adminId')) {
          args['adminId'] = null;
        } else if (args.adminId == '') {
          args['adminId'] = null;
        }

        return await transferBookingAmntTest(args).then(transferBookingAmntRes => {
          utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Success: ${JSON.stringify(transferBookingAmntRes)}`, utils.LOGLEVELS.INFO);

          return {
            data: transferBookingAmntRes,
          };

        }).catch(err => {

          utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
          throw Error(err);

        });

      }
    } catch (error) {
      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  // Edit a Stripe Card
  async stripeEditCard(_, args, context) {

    let logFuncName = 'stripeEditCard';

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
        utils.logData(`${logFileName}${logFuncName} args: ${args}`, utils.LOGLEVELS.INFO);

        return await shared.stripe.editCard(args).then(async function (res) {

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

  // create booking
  async createBooking(_, args, context) {

    let logFuncName = 'createBooking';

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

        // 0: calculate the price 
        let priceParams = {
          'chefId': args.chefId,
          'noOfGuest': args.noOfGuests,
          'complexity': args.complexity,
          'additionalServices': args.additionalServices
        };

        return await shared.db.getChefBookingPrice(priceParams).then(async function (getChefBookingPriceRes) {

          utils.logData(`${logFileName}${logFuncName} shared.db.getChefBookingPrice Res: ${JSON.stringify(getChefBookingPriceRes)}`, utils.LOGLEVELS.INFO);

          let bookingPrice = getChefBookingPriceRes.booking_price;
          let servicePercentage = getChefBookingPriceRes.service_charge;
          let commissionPrice = 0;

          if (servicePercentage !== 0 || servicePercentage !== null) {
            commissionPrice = (servicePercentage / 100) * bookingPrice;
          }

          const totalPrice = bookingPrice + commissionPrice;

          if (args.hasOwnProperty('additionalServices')) {
            if (args.additionalServices != null) {
              if (args.additionalServices.length != 0) {
                args.additionalServices = JSON.stringify(args.additionalServices);
              } else {
                args.additionalServices = null;
              }
            } else {
              args.additionalServices = null;
            }
          } else {
            args.additionalServices = null;
          }


          // 1: Create booking
          let bookingPayload = {
            chefId: args.chefId,
            customerId: args.customerId,
            fromTime: args.fromTime,
            toTime: args.toTime,
            // Booking Price
            bookingPrice: bookingPrice,
            bookingCurrency: 'USD',
            // Service Charge
            servicePrice: servicePercentage,
            serviceCurrency: '%',
            // Commission Price
            commissionPrice: commissionPrice,
            commissionCurrency: 'USD',
            // Total Price
            totalPrice: totalPrice,
            totalPriceCurrency: 'USD',
            dishTypeId: args.dishTypeId,
            // New Fields
            summary: args.summary,
            allergyTypeIds: args.allergyTypeIds,
            otherAllergyTypes: args.otherAllergyTypes,
            dietaryRestrictionsTypesIds: args.dietaryRestrictionsTypesIds,
            otherDietaryRestrictionsTypes: args.otherDietaryRestrictionsTypes,
            kitchenEquipmentTypeIds: args.kitchenEquipmentTypeIds,
            otherKitchenEquipmentTypes: args.otherKitchenEquipmentTypes,
            storeTypeIds: args.storeTypeIds,
            otherStoreTypes: args.otherStoreTypes,
            noOfGuests: args.noOfGuests,
            complexity: args.complexity,
            additionalServices: args.additionalServices,
            locationAddress: args.locationAddress,
            locationLat: args.locationLat,
            locationLng: args.locationLng,
            addrLine1: args.addrLine1,
            addrLine2: args.addrLine2,
            state: args.state,
            country: args.country,
            city: args.city,
            postalCode: args.postalCode
          };

          utils.logData(`${logFileName} ${logFuncName} bookingPayload: ${JSON.stringify(bookingPayload)}`, utils.LOGLEVELS.INFO);

          return await shared.db.createBooking(bookingPayload).then(async function (bookingRes) {

            utils.logData(`${logFileName} ${logFuncName} shared.db.createBooking Res: ${JSON.stringify(bookingRes)}`, utils.LOGLEVELS.INFO);

            let bookingHistId = bookingRes.chef_booking_hist_id;

            // if notes passed then insert here
            if (args.hasOwnProperty('notes')) {
              if (args.notes !== null && args.notes !== '') {
                await shared.db.insertNotes({
                  chefId: null,
                  customerId: args.customerId,
                  notes_description: args.notes,
                  table_name: 'chef_booking_history',
                  table_pk_id: bookingHistId
                });
              } else {
                utils.logData(`${logFileName} ${logFuncName} Notes is empty or null `, utils.LOGLEVELS.INFO);
              }
            } else {
              utils.logData(`${logFileName} ${logFuncName} Notes is empty or null`, utils.LOGLEVELS.INFO);
            }


            // 2: Make Payment
            // eslint-disable-next-line require-atomic-updates
            args['bookingHistId'] = bookingHistId;
            args['paymentDoneForType'] = 'NEW_PAYMENT_FOR_BOOKING';

            return await makeBookingPayment(args).then(async function (res) {
              utils.logData(`${logFileName} ${logFuncName} makeBookingPayment Success: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

              // get booking records
              let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

              return {
                data: bookingData,
              };

            }).catch(async function (err) {
              utils.logData(`${logFileName} ${logFuncName} makeBookingPayment Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);

              // get booking records
              let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

              return {
                data: bookingData,
              };

            });

          }).catch(function (error) {
            utils.logData(`${logFileName}${logFuncName} shared.db.createBooking Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
            throw Error(error);
          });

        }).catch(function (error) {
          utils.logData(`${logFileName}${logFuncName} shared.db.getChefBookingPrice Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);
        });

      }
    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  // create booking
  async createBookingTest(_, args, context) {

    let logFuncName = 'createBookingTest';

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

        // 0: calculate the price 
        let priceParams = {
          'chefId': args.chefId,
          'noOfGuest': args.noOfGuests,
          'complexity': args.complexity,
          'additionalServices': args.additionalServices
        };

        return await shared.db.getChefBookingPriceTest(priceParams).then(async function (getChefBookingPriceRes) {

          utils.logData(`${logFileName}${logFuncName} shared.db.getChefBookingPriceTest Res: ${JSON.stringify(getChefBookingPriceRes)}`, utils.LOGLEVELS.INFO);

          let bookingPrice = getChefBookingPriceRes.booking_price;
          let servicePercentage = getChefBookingPriceRes.service_charge;
          let stripeCommissionPrice = getChefBookingPriceRes.stripe_service_charge;
          let commissionPrice = 0;

          if (servicePercentage !== 0 || servicePercentage !== null) {
            commissionPrice = (servicePercentage / 100) * bookingPrice;
          }

          const totalPrice = bookingPrice - (commissionPrice + stripeCommissionPrice);

          if (args.hasOwnProperty('additionalServices')) {
            if (args.additionalServices != null) {
              if (args.additionalServices.length != 0) {
                args.additionalServices = JSON.stringify(args.additionalServices);
              } else {
                args.additionalServices = null;
              }
            } else {
              args.additionalServices = null;
            }
          } else {
            args.additionalServices = null;
          }


          // 1: Create booking
          let bookingPayload = {
            chefId: args.chefId,
            customerId: args.customerId,
            fromTime: args.fromTime,
            toTime: args.toTime,

            // Booking Price
            bookingPrice: bookingPrice,
            bookingCurrency: 'USD',

            // Service Charge
            servicePrice: servicePercentage,
            serviceCurrency: '%',

            // Commission Price
            commissionPrice: commissionPrice,
            commissionCurrency: 'USD',

            // Stripe Commission Price
            stripeCommissionPrice: stripeCommissionPrice,
            stripeCommissionCurrency: 'USD',

            // Total Price
            totalPrice: totalPrice,
            totalPriceCurrency: 'USD',
            dishTypeId: args.dishTypeId,

            // New Fields
            summary: args.summary,
            allergyTypeIds: args.allergyTypeIds,
            otherAllergyTypes: args.otherAllergyTypes,
            dietaryRestrictionsTypesIds: args.dietaryRestrictionsTypesIds,
            otherDietaryRestrictionsTypes: args.otherDietaryRestrictionsTypes,
            kitchenEquipmentTypeIds: args.kitchenEquipmentTypeIds,
            otherKitchenEquipmentTypes: args.otherKitchenEquipmentTypes,
            storeTypeIds: args.storeTypeIds,
            otherStoreTypes: args.otherStoreTypes,
            noOfGuests: args.noOfGuests,
            complexity: args.complexity,
            additionalServices: args.additionalServices,
            locationAddress: args.locationAddress,
            locationLat: args.locationLat,
            locationLng: args.locationLng,
            addrLine1: args.addrLine1,
            addrLine2: args.addrLine2,
            state: args.state,
            country: args.country,
            city: args.city,
            postalCode: args.postalCode
          };

          utils.logData(`${logFileName} ${logFuncName} bookingPayload: ${JSON.stringify(bookingPayload)}`, utils.LOGLEVELS.INFO);

          return await shared.db.createBookingTest(bookingPayload).then(async function (bookingRes) {

            utils.logData(`${logFileName} ${logFuncName} shared.db.createBookingTest Res: ${JSON.stringify(bookingRes)}`, utils.LOGLEVELS.INFO);

            let bookingHistId = bookingRes.chef_booking_hist_id;

            // if notes passed then insert here
            if (args.hasOwnProperty('notes')) {
              if (args.notes !== null && args.notes !== '') {
                await shared.db.insertNotes({
                  chefId: null,
                  customerId: args.customerId,
                  notes_description: args.notes,
                  table_name: 'chef_booking_history',
                  table_pk_id: bookingHistId
                });
              } else {
                utils.logData(`${logFileName} ${logFuncName} Notes is empty or null `, utils.LOGLEVELS.INFO);
              }
            } else {
              utils.logData(`${logFileName} ${logFuncName} Notes is empty or null`, utils.LOGLEVELS.INFO);
            }


            // 2: Make Payment
            // eslint-disable-next-line require-atomic-updates
            args['bookingHistId'] = bookingHistId;
            args['paymentDoneForType'] = 'NEW_PAYMENT_FOR_BOOKING';

            return await makeBookingPaymentTest(args).then(async function (res) {
              utils.logData(`${logFileName} ${logFuncName} makeBookingPaymentTest Success: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

              // get booking records
              let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

              return {
                data: bookingData,
              };

            }).catch(async function (err) {
              utils.logData(`${logFileName} ${logFuncName} makeBookingPaymentTest Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);

              // get booking records
              let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

              return {
                data: bookingData,
              };

            });

          }).catch(function (error) {
            utils.logData(`${logFileName}${logFuncName} shared.db.createBooking Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
            throw Error(error);
          });

        }).catch(function (error) {
          utils.logData(`${logFileName}${logFuncName} shared.db.getChefBookingPrice Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);
        });

      }
    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  // bookingPayment
  async bookingPayment(_, args, context) {

    let logFuncName = 'bookingPayment';

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

        utils.logData(`${logFileName} ${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

        // Make payment
        args['paymentDoneForType'] = 'ADDITIONAL_PAYMENT_FOR_BOOKING';

        return await makeBookingPayment(args).then(async function (res) {
          utils.logData(`${logFileName} ${logFuncName} makeBookingPayment Success: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

          // If payment done
          // if this function is called when doing additional payment
          // then transfer amount to chef
          // else pass the booking data 
          if (args.paymentDoneForType == 'ADDITIONAL_PAYMENT_FOR_BOOKING') {

            // get chefId's stripe userId
            let chefStripeUserId = await shared.db.getChefStripeUserId(args.chefId);

            utils.logData(`${logFileName} ${logFuncName} shared.db.getChefStripeUserId: ${JSON.stringify(chefStripeUserId)}`, utils.LOGLEVELS.INFO);

            // eslint-disable-next-line require-atomic-updates
            args['chefStripeUserId'] = chefStripeUserId.chef_profile_default_stripe_user_id;

            // 21st december 2019: Admin will transfer amount to chef from admin dashboard
            // 2: Transfer amnt to chef
            /*
            return await transferBookingAmnt(args).then(async function (transferBookingAmntRes) {
              utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Success: ${JSON.stringify(transferBookingAmntRes)}`, utils.LOGLEVELS.INFO);

              // get booking records
              let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

              return {
                data: bookingData,
              };

            }).catch(async function (err) {

              utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);

              // get booking records
              let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

              return {
                data: bookingData,
              };

            });*/

            // get booking records
            let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

            return {
              data: bookingData,
            };

          } else {

            // get booking records
            let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

            return {
              data: bookingData,
            };

          }

        }).catch(err => {
          utils.logData(`${logFileName} ${logFuncName} makeBookingPayment Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
          throw new Error(err.message);
        });

      }
    } catch (error) {
      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  // bookingPayment
  async bookingPaymentTest(_, args, context) {

    let logFuncName = 'bookingPaymentTest';

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

        utils.logData(`${logFileName} ${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

        // Make payment
        args['paymentDoneForType'] = 'ADDITIONAL_PAYMENT_FOR_BOOKING';

        return await makeBookingPaymentTest(args).then(async function (res) {
          utils.logData(`${logFileName} ${logFuncName} makeBookingPayment Success: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

          // If payment done
          // if this function is called when doing additional payment
          // then transfer amount to chef
          // else pass the booking data 
          if (args.paymentDoneForType == 'ADDITIONAL_PAYMENT_FOR_BOOKING') {

            // get chefId's stripe userId
            let chefStripeUserId = await shared.db.getChefStripeUserId(args.chefId);

            utils.logData(`${logFileName} ${logFuncName} shared.db.getChefStripeUserId: ${JSON.stringify(chefStripeUserId)}`, utils.LOGLEVELS.INFO);

            // eslint-disable-next-line require-atomic-updates
            args['chefStripeUserId'] = chefStripeUserId.chef_profile_default_stripe_user_id;

            // 21st december 2019: Admin will transfer amount to chef from admin dashboard
            // 2: Transfer amnt to chef
            /*
            return await transferBookingAmnt(args).then(async function (transferBookingAmntRes) {
              utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Success: ${JSON.stringify(transferBookingAmntRes)}`, utils.LOGLEVELS.INFO);

              // get booking records
              let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

              return {
                data: bookingData,
              };

            }).catch(async function (err) {

              utils.logData(`${logFileName} ${logFuncName} transferBookingAmnt Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);

              // get booking records
              let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

              return {
                data: bookingData,
              };

            });*/

            // get booking records
            let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

            return {
              data: bookingData,
            };

          } else {

            // get booking records
            let bookingData = await shared.db.getBookingDetails(args.bookingHistId);

            return {
              data: bookingData,
            };

          }

        }).catch(err => {
          utils.logData(`${logFileName} ${logFuncName} makeBookingPayment Catch Error: ${JSON.stringify(err)}`, utils.LOGLEVELS.ERROR);
          throw new Error(err.message);
        });

      }
    } catch (error) {
      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  // authenticate
  async authenticate(_, args, context) {

    let logFuncName = 'authenticate';
    let roleTypes = ['ADMIN', 'CHEF', 'CUSTOMER'];
    let authenticateTypes = ['REGISTER', 'LOGIN'];

    utils.logData(`${logFileName}${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

    let token = args.token;
    let roleType = args.roleType;
    let authenticateType = args.authenticateType;
    let extra = null;

    if (args.extra !== null) {
      extra = JSON.parse(args.extra);
    }

    let ssoType = null;
    let name = [];
    let email = null;
    let mobileNumber = null;
    let mobileCountryCode = null;
    let dob = null;

    // Check Params
    if (roleTypes.indexOf(roleType) == -1) {
      utils.logData(`${logFileName}${logFuncName} Given Role Type (${roleType}) Not Matching : ${roleTypes.toString()}`, utils.LOGLEVELS.ERROR);
      throw Error('INVALID_USER_TYPE');
    } else if (authenticateTypes.indexOf(authenticateType) == -1) {
      utils.logData(`${logFileName}${logFuncName} Given Authenticate Type (${authenticateType}) Not Matching : ${authenticateTypes.toString()}`, utils.LOGLEVELS.ERROR);
      throw Error('INVALID_AUTHENTICATE_TYPE');
    }

    // Verify Token
    let userdata = await shared.firebase.verifyIdToken(token).then(async function (res) {

      utils.logData(`${logFileName}${logFuncName} Result: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

      if (res.firebase.sign_in_provider == 'google.com') {
        ssoType = 'GOOGLE';
      } else if (res.firebase.sign_in_provider == 'facebook.com') {
        ssoType = 'FACEBOOK';
      } else if (res.firebase.sign_in_provider == 'custom' || res.firebase.sign_in_provider == 'password') {
        ssoType = 'EMAIL';
      }

      // If email is not passed, but it is passed in extra
      if (res.hasOwnProperty('email')) {
        if (res.email == null) {
          if (extra) {
            if (extra.hasOwnProperty('email')) {
              if (extra.email == null) {
                throw Error('EMAIL_IS_REQUIRED');
              } else {
                email = extra.email;
              }
            } else {
              throw Error('EMAIL_IS_REQUIRED');
            }
          } else {
            throw Error('EMAIL_IS_REQUIRED');
          }
        } else {
          email = res.email;
        }
      } else {
        if (extra) {
          if (extra.hasOwnProperty('email')) {
            if (extra.email == null) {
              throw Error('EMAIL_IS_REQUIRED');
            } else {
              email = extra.email;
            }
          } else {
            throw Error('EMAIL_IS_REQUIRED');
          }
        } else {
          throw Error('EMAIL_IS_REQUIRED');
        }
      }

      // Check if name is passed 
      if (res.hasOwnProperty('name')) {
        if (res.name == null) {
          if (extra) {
            if (extra.hasOwnProperty('firstname')) {
              name[0] = extra.firstname;
            } else {
              name[0] = null;
            }
            if (extra.hasOwnProperty('lastname')) {
              name[1] = extra.lastname;
            } else {
              name[1] = null;
            }
          } else {
            name[0] = null;
            name[1] = null;
          }
        } else {
          name = res.name.split(' ');
        }
      } else {
        if (extra) {
          if (extra.hasOwnProperty('firstname')) {
            name[0] = extra.firstname;
          } else {
            name[0] = null;
          }
          if (extra.hasOwnProperty('lastname')) {
            name[1] = extra.lastname;
          } else {
            name[1] = null;
          }
        } else {
          name[0] = null;
          name[1] = null;
        }
      }

      // Check if mobile-no is passed 
      if (res.hasOwnProperty('mobileNumber')) {
        if (res.mobileNumber == null) {
          if (extra) {
            if (extra.hasOwnProperty('mobileNumber')) {
              mobileNumber = extra.mobileNumber;
            }
          }
        } else {
          mobileNumber = res.mobileNumber;
        }
      } else {
        if (extra) {
          if (extra.hasOwnProperty('mobileNumber')) {
            mobileNumber = extra.mobileNumber;
          }
        }
      }

      // Check if dob is passed 
      if (res.hasOwnProperty('dob')) {
        if (res.dob == null) {
          if (extra) {
            if (extra.hasOwnProperty('dob')) {
              dob = extra.dob;
            }
          }
        } else {
          dob = res.dob;
        }
      } else {
        if (extra) {
          if (extra.hasOwnProperty('dob')) {
            dob = extra.dob;
          }
        }
      }

      // Get Code
      if (extra) {
        if (extra.hasOwnProperty('mobileCountryCode')) {
          mobileCountryCode = extra.mobileCountryCode;
        }
      }

      let payload = {
        'pFirstName': name[0],
        'pLastName': name[1],
        'pDob': dob,
        'pMobileNumber': mobileNumber,
        'pMobileNoCountryCode': mobileCountryCode,
        'pGender': null,
        'pEmail': email,
        'pSSOUid': res.user_id,
        'pSSOType': ssoType,
        'pType': authenticateType
      };

      return payload;

    }).catch(function (error) {
      let msg = error.code || error;
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(msg);
    });

    utils.logData(`${logFileName}${logFuncName} User Payload: ${JSON.stringify(userdata)}`, utils.LOGLEVELS.INFO);

    // if above gets solved, then call authenticate from db
    return await shared.db.authenticate(userdata, roleType).then(async function (res) {
      utils.logData(`${logFileName}${logFuncName} shared.db.authenticate Result: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);
      return res;
    }).catch(function (error) {
      utils.logData(`${logFileName}${logFuncName} shared.db.authenticate Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    });

  },

  async sendEmail(_, args, context) {

    let logFuncName = 'sendEmail';

    try {

      let isBlocked = await utils.isBlocked(context.headers);
      if (isBlocked) {
        throw new Error('USER_IS_BLOCKED');
      }

      utils.logData(`${logFileName}${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

      let messagePayload = {
        toEmail: args.email,
        subject: args.subject,
        message: args.message
      };

      return await shared.email.send(messagePayload).then(async function (res) {

        utils.logData(`${logFileName}${logFuncName} Res: ${JSON.stringify(res)}`, utils.LOGLEVELS.INFO);

        return {
          data: res
        };

      }).catch(function (error) {
        utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        throw Error(error);
      });

    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  async saveChefBankDetails(_, args, context) {

    let logFuncName = 'saveChefBankDetails';

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

        return await shared.stripe.authToken(args.token).then(async function (authTokenRes) {

          utils.logData(`${logFileName} ${logFuncName} shared.stripe.authToken Res: ${JSON.stringify(authTokenRes)}`, utils.LOGLEVELS.INFO);

          authTokenRes.chefId = args.chefId;

          return await shared.db.insertChefBankDetails(authTokenRes).then(async function (insertChefBankDetailsRes) {

            utils.logData(`${logFileName} ${logFuncName} shared.db.insertChefBankDetails Res: ${JSON.stringify(insertChefBankDetailsRes)}`, utils.LOGLEVELS.INFO);

            return {
              data: insertChefBankDetailsRes
            };

          }).catch(function (error) {
            utils.logData(`${logFileName} ${logFuncName} shared.db.insertChefBankDetails Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
            throw Error(error);
          });

        }).catch(function (error) {

          utils.logData(`${logFileName} ${logFuncName} shared.stripe.authToken Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);

        });

      }

    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }
  },

  async stripeRemoveChefAccount(_, args, context) {

    let logFuncName = 'stripeRemoveChefAccount';

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

        utils.logData(`${logFileName}${logFuncName} args: ${args}`, utils.LOGLEVELS.INFO);

        let chefId = args.chefId;
        let accountId = args.accountId;

        return await shared.stripe.removeAccount(accountId).then(async function (removeAccountRes) {

          utils.logData(`${logFileName}${logFuncName} shared.stripe.removeAccount Res: ${JSON.stringify(removeAccountRes)}`, utils.LOGLEVELS.INFO);

          return await shared.db.removeChefBankDetails(chefId, accountId).then(async function (removeChefBankDetailsRes) {

            utils.logData(`${logFileName}${logFuncName} shared.db.removeChefBankDetails Res: ${JSON.stringify(removeChefBankDetailsRes)}`, utils.LOGLEVELS.INFO);

            return {
              data: removeAccountRes
            };

          }).catch(function (error) {

            utils.logData(`${logFileName}${logFuncName} shared.db.removeChefBankDetails Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
            throw Error(error);

          });

        }).catch(function (error) {

          utils.logData(`${logFileName}${logFuncName} shared.stripe.removeAccount Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);

        });

      }
    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }

  },

  async stripeRefundAmtToCustomer(_, args, context) {
    let logFuncName = 'refundAmtToCustomer';

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

        // get booking details
        return await shared.db.getBookingDetails(args.bookingHistId).then(async function (getBookingDetailsRes) {

          utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingDetails Res: ${JSON.stringify(getBookingDetailsRes)}`, utils.LOGLEVELS.INFO);

          // check if payment is done already
          utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingDetails getBookingDetailsRes.payment_hist_ids: ${JSON.stringify(getBookingDetailsRes.payment_hist_ids)}`, utils.LOGLEVELS.INFO);
          utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingDetails getBookingDetailsRes.payment_hist_ids Length: ${getBookingDetailsRes.payment_hist_ids.length}`, utils.LOGLEVELS.INFO);

          if (getBookingDetailsRes.payment_hist_ids != null && getBookingDetailsRes.payment_hist_ids.length != 0) {

            let bookingData = getBookingDetailsRes;
            let paymentHistIds = getBookingDetailsRes.payment_hist_ids;

            // Deleting key from object due to reject_cancel reason string under 40 characters
            delete bookingData['chef_booking_chef_reject_or_cancel_reason'];
            delete bookingData['chef_booking_customer_reject_or_cancel_reason'];
            delete bookingData['chef_booking_commission_charge_price_value'];
            delete bookingData['chef_booking_stripe_commission_price_value'];
            delete bookingData['chef_booking_stripe_commission_price_unit'];
            delete bookingData['chef_booking_status_id'];
            delete bookingData['chef_booking_dish_type_id'];
            delete bookingData['chef_booking_summary'];
            delete bookingData['chef_booking_allergy_type_id'];
            delete bookingData['chef_booking_other_allergy_types'];
            delete bookingData['chef_booking_dietary_restrictions_type_id'];
            delete bookingData['chef_booking_other_dietary_restrictions_types'];
            delete bookingData['chef_booking_kitchen_equipment_type_id'];
            delete bookingData['chef_booking_other_kitchen_equipment_types'];
            delete bookingData['chef_booking_store_type_id'];
            delete bookingData['chef_booking_other_store_types'];
            delete bookingData['chef_booking_additional_services'];
            delete bookingData['payment_hist_ids'];

            let bookingHistId = args.bookingHistId;

            utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingDetails paymentHistIds Length: ${paymentHistIds.length}`, utils.LOGLEVELS.INFO);

            // Loop all payments for refund
            let processedRefundPayments = 0;
            let i = 0;

            for (i = 0; i < paymentHistIds.length; i++) {

              let paymentHistId = paymentHistIds[i];

              // get booking payment details
              await shared.db.getBookingPaymentDetails(paymentHistId).then(async function (getBookingPaymentDetailsRes) {

                utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingPaymentDetails Res: ${JSON.stringify(getBookingPaymentDetailsRes)}`, utils.LOGLEVELS.INFO);

                let chargeId = getBookingPaymentDetailsRes.payment_id;

                // refund the amt
                await shared.stripe.refundAmt(chargeId, getBookingDetailsRes.chef_booking_price_value, getBookingDetailsRes.chef_booking_price_unit, bookingData).then(async function (refundAmtRes) {

                  utils.logData(`${logFileName}${logFuncName} shared.stripe.refundAmt Res: ${JSON.stringify(refundAmtRes)}`, utils.LOGLEVELS.INFO);

                  // Insert into refund table
                  let saveRefundPaymentPayload = {
                    customerId: args.customerId,
                    paymentHistId: paymentHistId,
                    bookingHistId: bookingHistId,
                    chargeId: chargeId,
                    refundId: refundAmtRes.id,
                    dataAsJson: refundAmtRes
                  };

                  utils.logData(`${logFileName}${logFuncName} saveRefundPaymentPayload: ${JSON.stringify(saveRefundPaymentPayload)}`, utils.LOGLEVELS.INFO);

                  await shared.db.insertRefundPayment(saveRefundPaymentPayload).then(async function (insertRefundPaymentRes) {

                    utils.logData(`${logFileName}${logFuncName} shared.db.insertPayment Res: ${JSON.stringify(insertRefundPaymentRes)}`, utils.LOGLEVELS.INFO);

                    processedRefundPayments = processedRefundPayments + 1;

                  }).catch(function (error) {

                    processedRefundPayments = processedRefundPayments + 1;
                    utils.logData(`${logFileName}${logFuncName} shared.db.insertPayment Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
                    // throw Error(error);

                  });

                }).catch(async function (error) {

                  // Update booking status with transfer failed;
                  processedRefundPayments = processedRefundPayments + 1;
                  await shared.db.updateBookingStatus(args.bookingHistId, 'REFUND_AMOUNT_FAILED');

                  utils.logData(`${logFileName} ${logFuncName} shared.stripe.transferAmt Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
                  // throw Error('FAILED_TO_TRANSFER_AMOUNT');

                });

              }).catch(function (error) {

                utils.logData(`${logFileName}${logFuncName} shared.db.getBookingPaymentDetails Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
                // throw Error(error);

              });
            }

            // If all process the return data 
            if (processedRefundPayments == paymentHistIds.length) {

              // get booking records
              let bookingData = await shared.db.getBookingDetails(bookingHistId);

              return {
                data: bookingData,
              };

            }

          } else {
            utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingDetails 'NO_PAYMENT_ATTACHED_TO_BOOKING`, utils.LOGLEVELS.ERROR);
            throw Error('NO_PAYMENT_ATTACHED_TO_BOOKING');
          }

        }).catch(function (error) {
          utils.logData(`${logFileName}${logFuncName} shared.db.getBookingDetails Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
          throw Error(error);
        });

      }
    } catch (error) {
      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);
    }
  }

};

/****************************** Share function in resolvers ****************************************************/


// Make payment for booking
export async function makeBookingPayment(args) {

  let logFuncName = 'SubFunction: MakeBookingPayment';

  utils.logData(`${logFileName} ${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

  // 0: get booking details
  return await shared.db.getBookingDetails(args.bookingHistId).then(async function (getBookingDetailsRes) {

    utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingDetails Res: ${JSON.stringify(getBookingDetailsRes)}`, utils.LOGLEVELS.INFO);

    let chefBookingDetailRes = getBookingDetailsRes;

    // Deleting key from object due to reject_cancel reason string under 40 characters
    delete chefBookingDetailRes['chef_booking_chef_reject_or_cancel_reason'];
    delete chefBookingDetailRes['chef_booking_customer_reject_or_cancel_reason'];
    delete chefBookingDetailRes['chef_booking_commission_charge_price_value'];
    delete chefBookingDetailRes['chef_booking_stripe_commission_price_value'];
    delete chefBookingDetailRes['chef_booking_stripe_commission_price_unit'];
    delete chefBookingDetailRes['chef_booking_status_id'];
    delete chefBookingDetailRes['chef_booking_dish_type_id'];
    delete chefBookingDetailRes['chef_booking_summary'];
    delete chefBookingDetailRes['chef_booking_allergy_type_id'];
    delete chefBookingDetailRes['chef_booking_other_allergy_types'];
    delete chefBookingDetailRes['chef_booking_dietary_restrictions_type_id'];
    delete chefBookingDetailRes['chef_booking_other_dietary_restrictions_types'];
    delete chefBookingDetailRes['chef_booking_kitchen_equipment_type_id'];
    delete chefBookingDetailRes['chef_booking_other_kitchen_equipment_types'];
    delete chefBookingDetailRes['chef_booking_store_type_id'];
    delete chefBookingDetailRes['chef_booking_other_store_types'];
    delete chefBookingDetailRes['chef_booking_additional_services'];
    delete chefBookingDetailRes['payment_hist_ids'];
    
    // 1: Make Payment
    let paymentPayload = {};
    let paymentOriginalPriceValueFormat = null;
    let paymentOriginalPriceUnitFormat = null;

    // if new payment then price and unit passed
    if (args.hasOwnProperty('price') && args.price !== null) {

      utils.logData(`${logFileName} ${logFuncName} Price Given: ${args.price}`, utils.LOGLEVELS.INFO);

      paymentOriginalPriceValueFormat = args.price;
      paymentOriginalPriceUnitFormat = 'USD';

      // Convert $ to cents
      paymentPayload = {
        price: parseInt(100 * args.price),
        currency: 'USD',
        stripeCustomerId: args.stripeCustomerId,
        cardId: args.cardId,
      };

    } else {

      utils.logData(`${logFileName} ${logFuncName} Price Not Given, Take booking price: ${chefBookingDetailRes.chef_booking_total_price_value}`, utils.LOGLEVELS.INFO);

      paymentOriginalPriceValueFormat = chefBookingDetailRes.chef_booking_total_price_value;
      paymentOriginalPriceUnitFormat = 'USD';

      // Convert $ to cents
      paymentPayload = {
        price: parseInt(100 * chefBookingDetailRes.chef_booking_total_price_value),
        currency: 'USD',
        stripeCustomerId: args.stripeCustomerId,
        cardId: args.cardId,
      };

    }

    utils.logData(`${logFileName}${logFuncName} paymentPayload: ${JSON.stringify(paymentPayload)}`, utils.LOGLEVELS.INFO);

    return await shared.stripe.chargeCard(paymentPayload, chefBookingDetailRes).then(async function (paymentRes) {

      utils.logData(`${logFileName}${logFuncName} shared.stripe.chargeCard Res: ${JSON.stringify(paymentRes)}`, utils.LOGLEVELS.INFO);

      // 3: Insert into payment table
      let savePaymentPayload = {
        bookingHistId: args.bookingHistId,
        paymentId: paymentRes.id,
        paymentStripeCustomerId: args.stripeCustomerId,
        paymentCardId: args.cardId,
        paymentOrderId: null,
        paymentTransactionId: paymentRes.balance_transaction,
        paymentStatusId: 'PAID',
        paymentMethod: paymentRes.payment_method,
        paymentActualAmount: paymentRes.amount,
        paymentActualAmountUnit: paymentRes.currency,
        paymentTotalAmount: paymentRes.amount,
        paymentTotalAmountUnit: paymentRes.currency,
        paymentReceiptUrl: paymentRes.receipt_url,
        paymentDataAsJson: paymentRes,
        paymentDoneByCustomerId: chefBookingDetailRes.customer_id,
        paymentDoneForChefId: chefBookingDetailRes.chef_id,
        paymentDoneForType: args.paymentDoneForType,
        paymentOriginalPriceValueFormat: paymentOriginalPriceValueFormat,
        paymentOriginalPriceUnitFormat: paymentOriginalPriceUnitFormat
      };

      utils.logData(`${logFileName}${logFuncName} savePaymentPayload: ${JSON.stringify(savePaymentPayload)}`, utils.LOGLEVELS.INFO);

      return await shared.db.insertPayment(savePaymentPayload).then(async function (savePaymentRes) {

        utils.logData(`${logFileName}${logFuncName} shared.db.insertPayment Res: ${JSON.stringify(savePaymentRes)}`, utils.LOGLEVELS.INFO);

        return {
          data: savePaymentRes
        };

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} shared.db.insertPayment Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        throw Error(error);

      });


    }).catch(async function (error) {

      // Dont update if payment is additional one
      if (args.paymentDoneForType !== 'ADDITIONAL_PAYMENT_FOR_BOOKING') {

        // Update booking status with payment failed;
        await shared.db.updateBookingStatus(args.bookingHistId, 'PAYMENT_FAILED');
      }

      // if payment is not done
      // Insert into payment table
      let savePaymentPayload = {
        bookingHistId: args.bookingHistId,
        paymentId: null,
        paymentStripeCustomerId: args.stripeCustomerId,
        paymentCardId: args.cardId,
        paymentOrderId: null,
        paymentTransactionId: null,
        paymentStatusId: 'FAILED',
        paymentMethod: null,
        paymentActualAmount: null,
        paymentActualAmountUnit: null,
        paymentTotalAmount: null,
        paymentTotalAmountUnit: null,
        paymentReceiptUrl: null,
        paymentDataAsJson: null,
        paymentDoneByCustomerId: chefBookingDetailRes.customer_id,
        paymentDoneForChefId: chefBookingDetailRes.chef_id,
        paymentDoneForType: args.paymentDoneForType,
        paymentOriginalPriceValueFormat: paymentOriginalPriceValueFormat,
        paymentOriginalPriceUnitFormat: paymentOriginalPriceUnitFormat
      };

      utils.logData(`${logFileName} ${logFuncName} savePaymentPayload: ${JSON.stringify(savePaymentPayload)}`, utils.LOGLEVELS.INFO);

      await shared.db.insertPayment(savePaymentPayload).then(async function (savePaymentRes) {

        utils.logData(`${logFileName} ${logFuncName} shared.db.insertPayment Res: ${JSON.stringify(savePaymentRes)}`, utils.LOGLEVELS.INFO);

        return {
          data: savePaymentRes
        };

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} shared.db.insertPayment Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);

      });

      utils.logData(`${logFileName}${logFuncName} shared.stripe.chargeCard Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);

    });


  }).catch(function (error) {
    utils.logData(`${logFileName}${logFuncName} shared.db.getBookingDetails Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
    throw Error(error);
  });
}

// Make payment for booking
export async function makeBookingPaymentTest(args) {

  let logFuncName = 'SubFunction: makeBookingPaymentTest';

  utils.logData(`${logFileName} ${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

  // 0: get booking details
  return await shared.db.getBookingDetails(args.bookingHistId).then(async function (getBookingDetailsRes) {

    utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingDetails Res: ${JSON.stringify(getBookingDetailsRes)}`, utils.LOGLEVELS.INFO);

    let chefBookingDetailRes = getBookingDetailsRes;

    // Deleting key from object due to reject_cancel reason string under 40 characters
    delete chefBookingDetailRes['chef_booking_chef_reject_or_cancel_reason'];
    delete chefBookingDetailRes['chef_booking_customer_reject_or_cancel_reason'];
    delete chefBookingDetailRes['chef_booking_commission_charge_price_value'];
    delete chefBookingDetailRes['chef_booking_stripe_commission_price_value'];
    delete chefBookingDetailRes['chef_booking_stripe_commission_price_unit'];
    delete chefBookingDetailRes['chef_booking_status_id'];
    delete chefBookingDetailRes['chef_booking_dish_type_id'];
    delete chefBookingDetailRes['chef_booking_summary'];
    delete chefBookingDetailRes['chef_booking_allergy_type_id'];
    delete chefBookingDetailRes['chef_booking_other_allergy_types'];
    delete chefBookingDetailRes['chef_booking_dietary_restrictions_type_id'];
    delete chefBookingDetailRes['chef_booking_other_dietary_restrictions_types'];
    delete chefBookingDetailRes['chef_booking_kitchen_equipment_type_id'];
    delete chefBookingDetailRes['chef_booking_other_kitchen_equipment_types'];
    delete chefBookingDetailRes['chef_booking_store_type_id'];
    delete chefBookingDetailRes['chef_booking_other_store_types'];
    delete chefBookingDetailRes['chef_booking_additional_services'];
    delete chefBookingDetailRes['payment_hist_ids'];

    // 1: Make Payment
    let paymentPayload = {};
    let paymentOriginalPriceValueFormat = null;
    let paymentOriginalPriceUnitFormat = null;

    // if new payment then price and unit passed
    if (args.hasOwnProperty('price') && args.price !== null) {

      utils.logData(`${logFileName} ${logFuncName} Price Given: ${args.price}`, utils.LOGLEVELS.INFO);

      paymentOriginalPriceValueFormat = args.price;
      paymentOriginalPriceUnitFormat = 'USD';

      // Convert $ to cents
      paymentPayload = {
        price: parseInt(100 * args.price),
        currency: 'USD',
        stripeCustomerId: args.stripeCustomerId,
        cardId: args.cardId,
      };

    } else {

      utils.logData(`${logFileName} ${logFuncName} Price Not Given, Take booking price: ${chefBookingDetailRes.chef_booking_price_value}`, utils.LOGLEVELS.INFO);

      paymentOriginalPriceValueFormat = chefBookingDetailRes.chef_booking_price_value;
      paymentOriginalPriceUnitFormat = 'USD';

      // Convert $ to cents
      paymentPayload = {
        price: parseInt(100 * chefBookingDetailRes.chef_booking_price_value),
        currency: 'USD',
        stripeCustomerId: args.stripeCustomerId,
        cardId: args.cardId,
      };

    }

    utils.logData(`${logFileName}${logFuncName} paymentPayload: ${JSON.stringify(paymentPayload)}`, utils.LOGLEVELS.INFO);

    return await shared.stripe.chargeCard(paymentPayload, chefBookingDetailRes).then(async function (paymentRes) {

      utils.logData(`${logFileName}${logFuncName} shared.stripe.chargeCard Res: ${JSON.stringify(paymentRes)}`, utils.LOGLEVELS.INFO);

      // 3: Insert into payment table
      let savePaymentPayload = {
        bookingHistId: args.bookingHistId,
        paymentId: paymentRes.id,
        paymentStripeCustomerId: args.stripeCustomerId,
        paymentCardId: args.cardId,
        paymentOrderId: null,
        paymentTransactionId: paymentRes.balance_transaction,
        paymentStatusId: 'PAID',
        paymentMethod: paymentRes.payment_method,
        paymentActualAmount: paymentRes.amount,
        paymentActualAmountUnit: paymentRes.currency,
        paymentTotalAmount: paymentRes.amount,
        paymentTotalAmountUnit: paymentRes.currency,
        paymentReceiptUrl: paymentRes.receipt_url,
        paymentDataAsJson: paymentRes,
        paymentDoneByCustomerId: chefBookingDetailRes.customer_id,
        paymentDoneForChefId: chefBookingDetailRes.chef_id,
        paymentDoneForType: args.paymentDoneForType,
        paymentOriginalPriceValueFormat: paymentOriginalPriceValueFormat,
        paymentOriginalPriceUnitFormat: paymentOriginalPriceUnitFormat
      };

      utils.logData(`${logFileName}${logFuncName} savePaymentPayload: ${JSON.stringify(savePaymentPayload)}`, utils.LOGLEVELS.INFO);

      return await shared.db.insertPayment(savePaymentPayload).then(async function (savePaymentRes) {

        utils.logData(`${logFileName}${logFuncName} shared.db.insertPayment Res: ${JSON.stringify(savePaymentRes)}`, utils.LOGLEVELS.INFO);

        return {
          data: savePaymentRes
        };

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} shared.db.insertPayment Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        throw Error(error);

      });


    }).catch(async function (error) {

      // Dont update if payment is additional one
      if (args.paymentDoneForType !== 'ADDITIONAL_PAYMENT_FOR_BOOKING') {

        // Update booking status with payment failed;
        await shared.db.updateBookingStatus(args.bookingHistId, 'PAYMENT_FAILED');
      }

      // if payment is not done
      // Insert into payment table
      let savePaymentPayload = {
        bookingHistId: args.bookingHistId,
        paymentId: null,
        paymentStripeCustomerId: args.stripeCustomerId,
        paymentCardId: args.cardId,
        paymentOrderId: null,
        paymentTransactionId: null,
        paymentStatusId: 'FAILED',
        paymentMethod: null,
        paymentActualAmount: null,
        paymentActualAmountUnit: null,
        paymentTotalAmount: null,
        paymentTotalAmountUnit: null,
        paymentReceiptUrl: null,
        paymentDataAsJson: null,
        paymentDoneByCustomerId: chefBookingDetailRes.customer_id,
        paymentDoneForChefId: chefBookingDetailRes.chef_id,
        paymentDoneForType: args.paymentDoneForType,
        paymentOriginalPriceValueFormat: paymentOriginalPriceValueFormat,
        paymentOriginalPriceUnitFormat: paymentOriginalPriceUnitFormat
      };

      utils.logData(`${logFileName} ${logFuncName} savePaymentPayload: ${JSON.stringify(savePaymentPayload)}`, utils.LOGLEVELS.INFO);

      await shared.db.insertPayment(savePaymentPayload).then(async function (savePaymentRes) {

        utils.logData(`${logFileName} ${logFuncName} shared.db.insertPayment Res: ${JSON.stringify(savePaymentRes)}`, utils.LOGLEVELS.INFO);

        return {
          data: savePaymentRes
        };

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} shared.db.insertPayment Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);

      });

      utils.logData(`${logFileName}${logFuncName} shared.stripe.chargeCard Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);

    });


  }).catch(function (error) {
    utils.logData(`${logFileName}${logFuncName} shared.db.getBookingDetails Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
    throw Error(error);
  });
}

// Transfer Amt to chef
export async function transferBookingAmnt(args) {

  let logFuncName = 'SubFunction: transferBookingAmnt';

  utils.logData(`${logFileName} ${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

  // 0: get booking details
  return await shared.db.getBookingDetails(args.bookingHistId).then(async function (getBookingDetailsRes) {

    utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingDetails Res: ${JSON.stringify(getBookingDetailsRes)}`, utils.LOGLEVELS.INFO);

    let chefBookingDetailRes = getBookingDetailsRes;

    // Deleting key from object due to reject_cancel reason string under 40 characters
    delete chefBookingDetailRes['chef_booking_chef_reject_or_cancel_reason'];
    delete chefBookingDetailRes['chef_booking_customer_reject_or_cancel_reason'];
    delete chefBookingDetailRes['chef_booking_commission_charge_price_value'];
    delete chefBookingDetailRes['chef_booking_stripe_commission_price_value'];
    delete chefBookingDetailRes['chef_booking_stripe_commission_price_unit'];
    delete chefBookingDetailRes['chef_booking_status_id'];
    delete chefBookingDetailRes['chef_booking_dish_type_id'];
    delete chefBookingDetailRes['chef_booking_summary'];
    delete chefBookingDetailRes['chef_booking_allergy_type_id'];
    delete chefBookingDetailRes['chef_booking_other_allergy_types'];
    delete chefBookingDetailRes['chef_booking_dietary_restrictions_type_id'];
    delete chefBookingDetailRes['chef_booking_other_dietary_restrictions_types'];
    delete chefBookingDetailRes['chef_booking_kitchen_equipment_type_id'];
    delete chefBookingDetailRes['chef_booking_other_kitchen_equipment_types'];
    delete chefBookingDetailRes['chef_booking_store_type_id'];
    delete chefBookingDetailRes['chef_booking_other_store_types'];
    delete chefBookingDetailRes['chef_booking_additional_services'];
    delete chefBookingDetailRes['payment_hist_ids'];


    let amnt = parseInt(100 * chefBookingDetailRes.chef_booking_price_value);

    return await shared.stripe.retrieveBalanceAmt().then(async function (retrieveBalanceAmtRes) {

      utils.logData(`${logFileName}${logFuncName} shared.stripe.retrieveBalanceAmt Res: ${JSON.stringify(retrieveBalanceAmtRes)}`, utils.LOGLEVELS.INFO);

      if (retrieveBalanceAmtRes.hasOwnProperty('available')) {

        if (retrieveBalanceAmtRes.available.length != 0) {

          if (retrieveBalanceAmtRes.available[0].hasOwnProperty('amount')) {

            let availableBalance = retrieveBalanceAmtRes.available[0].amount;

            utils.logData(`${logFileName} ${logFuncName} availableBalance: ${availableBalance}`, utils.LOGLEVELS.ERROR);
            utils.logData(`${logFileName} ${logFuncName} amnt: ${amnt}`, utils.LOGLEVELS.ERROR);

            if (availableBalance > amnt) {

              utils.logData(`${logFileName} ${logFuncName} Balance is availlable`, utils.LOGLEVELS.INFO);

              return await shared.stripe.transferAmt(amnt, chefBookingDetailRes.chef_booking_price_unit, args.chefStripeUserId, chefBookingDetailRes).then(async function (transferAmtRes) {

                utils.logData(`${logFileName} ${logFuncName} shared.stripe.transferAmt Res: ${JSON.stringify(transferAmtRes)}`, utils.LOGLEVELS.INFO);

                let transferAmt = {
                  amt: chefBookingDetailRes.chef_booking_price_value,
                  amtCurrency: chefBookingDetailRes.chef_booking_price_unit,
                  bookingHistId: args.bookingHistId,
                  adminId: args.adminId ? args.adminId : null,
                  chefId: args.chefId,
                  chefStripeUserId: args.chefStripeUserId,
                  dataAsJson: transferAmtRes
                };

                //  insert into db
                return await shared.db.insertBankTransfer(transferAmt).then(async function (saveTransferRes) {
                  utils.logData(`${logFileName} ${logFuncName} shared.db.insertBankTransfer Res: ${JSON.stringify(saveTransferRes)}`, utils.LOGLEVELS.INFO);

                  return {
                    data: saveTransferRes
                  };

                }).catch(function (error) {

                  utils.logData(`${logFileName} ${logFuncName} shared.db.insertBankTransfer Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
                  throw Error(error);

                });

              }).catch(async function (error) {

                // Update booking status with transfer failed;
                await shared.db.updateBookingStatus(args.bookingHistId, 'AMOUNT_TRANSFER_FAILED');

                utils.logData(`${logFileName} ${logFuncName} shared.stripe.transferAmt Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
                throw Error(error);

              });

            } else {

              utils.logData(`${logFileName} ${logFuncName} Balance is low`, utils.LOGLEVELS.ERROR);

              // Insufficent Balance
              throw Error('INSUFFICENT_BALANCE');

            }
          } else {

            utils.logData(`${logFileName} ${logFuncName} No Amount field is present in object`, utils.LOGLEVELS.ERROR);

            // Insufficent Balance
            throw Error('INSUFFICENT_BALANCE');

          }
        } else {

          utils.logData(`${logFileName} ${logFuncName} available length is empty in object`, utils.LOGLEVELS.ERROR);

          // Insufficent Balance
          throw Error('INSUFFICENT_BALANCE');
        }

      } else {

        utils.logData(`${logFileName} ${logFuncName} No avilable is not empty in object`, utils.LOGLEVELS.ERROR);

        // Insufficent Balance
        throw Error('INSUFFICENT_BALANCE');
      }

    }).catch(async function (error) {

      // Update booking status with transfer failed;
      await shared.db.updateBookingStatus(args.bookingHistId, 'AMOUNT_TRANSFER_FAILED');

      utils.logData(`${logFileName} ${logFuncName} shared.stripe.transferAmt Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);

    });

  }).catch(function (error) {

    utils.logData(`${logFileName}${logFuncName} shared.db.getBookingDetails Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
    throw Error(error);

  });
}

// Transfer Amt to chef
export async function transferBookingAmntTest(args) {

  let logFuncName = 'SubFunction: transferBookingAmntTest';

  utils.logData(`${logFileName} ${logFuncName} args: ${JSON.stringify(args)}`, utils.LOGLEVELS.INFO);

  // 0: get booking details
  return await shared.db.getBookingDetails(args.bookingHistId).then(async function (getBookingDetailsRes) {

    utils.logData(`${logFileName} ${logFuncName} shared.db.getBookingDetails Res: ${JSON.stringify(getBookingDetailsRes)}`, utils.LOGLEVELS.INFO);

    let chefBookingDetailRes = getBookingDetailsRes;

    // Deleting key from object due to reject_cancel reason string under 40 characters
    delete chefBookingDetailRes['chef_booking_chef_reject_or_cancel_reason'];
    delete chefBookingDetailRes['chef_booking_customer_reject_or_cancel_reason'];
    delete chefBookingDetailRes['chef_booking_commission_charge_price_value'];
    delete chefBookingDetailRes['chef_booking_stripe_commission_price_value'];
    delete chefBookingDetailRes['chef_booking_stripe_commission_price_unit'];
    delete chefBookingDetailRes['chef_booking_status_id'];
    delete chefBookingDetailRes['chef_booking_dish_type_id'];
    delete chefBookingDetailRes['chef_booking_summary'];
    delete chefBookingDetailRes['chef_booking_allergy_type_id'];
    delete chefBookingDetailRes['chef_booking_other_allergy_types'];
    delete chefBookingDetailRes['chef_booking_dietary_restrictions_type_id'];
    delete chefBookingDetailRes['chef_booking_other_dietary_restrictions_types'];
    delete chefBookingDetailRes['chef_booking_kitchen_equipment_type_id'];
    delete chefBookingDetailRes['chef_booking_other_kitchen_equipment_types'];
    delete chefBookingDetailRes['chef_booking_store_type_id'];
    delete chefBookingDetailRes['chef_booking_other_store_types'];
    delete chefBookingDetailRes['chef_booking_additional_services'];
    delete chefBookingDetailRes['payment_hist_ids'];


    let amount_without_service = chefBookingDetailRes.chef_booking_total_price_unit;
    let amnt = parseInt(100 * amount_without_service);

    return await shared.stripe.retrieveBalanceAmt().then(async function (retrieveBalanceAmtRes) {

      utils.logData(`${logFileName}${logFuncName} shared.stripe.retrieveBalanceAmt Res: ${JSON.stringify(retrieveBalanceAmtRes)}`, utils.LOGLEVELS.INFO);

      if (retrieveBalanceAmtRes.hasOwnProperty('available')) {

        if (retrieveBalanceAmtRes.available.length != 0) {

          if (retrieveBalanceAmtRes.available[0].hasOwnProperty('amount')) {

            let availableBalance = retrieveBalanceAmtRes.available[0].amount;

            utils.logData(`${logFileName} ${logFuncName} availableBalance: ${availableBalance}`, utils.LOGLEVELS.ERROR);
            utils.logData(`${logFileName} ${logFuncName} amnt: ${amnt}`, utils.LOGLEVELS.ERROR);

            if (availableBalance > amnt) {

              utils.logData(`${logFileName} ${logFuncName} Balance is availlable`, utils.LOGLEVELS.INFO);

              return await shared.stripe.transferAmt(amnt, chefBookingDetailRes.chef_booking_price_unit, args.chefStripeUserId, chefBookingDetailRes).then(async function (transferAmtRes) {

                utils.logData(`${logFileName} ${logFuncName} shared.stripe.transferAmt Res: ${JSON.stringify(transferAmtRes)}`, utils.LOGLEVELS.INFO);

                let transferAmt = {
                  amt: amount_without_service,
                  amtCurrency: chefBookingDetailRes.chef_booking_price_unit,
                  bookingHistId: args.bookingHistId,
                  adminId: args.adminId ? args.adminId : null,
                  chefId: args.chefId,
                  chefStripeUserId: args.chefStripeUserId,
                  dataAsJson: transferAmtRes
                };

                //  insert into db
                return await shared.db.insertBankTransfer(transferAmt).then(async function (saveTransferRes) {
                  utils.logData(`${logFileName} ${logFuncName} shared.db.insertBankTransfer Res: ${JSON.stringify(saveTransferRes)}`, utils.LOGLEVELS.INFO);

                  return {
                    data: saveTransferRes
                  };

                }).catch(function (error) {

                  utils.logData(`${logFileName} ${logFuncName} shared.db.insertBankTransfer Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
                  throw Error(error);

                });

              }).catch(async function (error) {

                // Update booking status with transfer failed;
                await shared.db.updateBookingStatus(args.bookingHistId, 'AMOUNT_TRANSFER_FAILED');

                utils.logData(`${logFileName} ${logFuncName} shared.stripe.transferAmt Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
                throw Error(error);

              });

            } else {

              utils.logData(`${logFileName} ${logFuncName} Balance is low`, utils.LOGLEVELS.ERROR);

              // Insufficent Balance
              throw Error('INSUFFICENT_BALANCE');

            }
          } else {

            utils.logData(`${logFileName} ${logFuncName} No Amount field is present in object`, utils.LOGLEVELS.ERROR);

            // Insufficent Balance
            throw Error('INSUFFICENT_BALANCE');

          }
        } else {

          utils.logData(`${logFileName} ${logFuncName} available length is empty in object`, utils.LOGLEVELS.ERROR);

          // Insufficent Balance
          throw Error('INSUFFICENT_BALANCE');
        }

      } else {

        utils.logData(`${logFileName} ${logFuncName} No avilable is not empty in object`, utils.LOGLEVELS.ERROR);

        // Insufficent Balance
        throw Error('INSUFFICENT_BALANCE');
      }

    }).catch(async function (error) {

      // Update booking status with transfer failed;
      await shared.db.updateBookingStatus(args.bookingHistId, 'AMOUNT_TRANSFER_FAILED');

      utils.logData(`${logFileName} ${logFuncName} shared.stripe.transferAmt Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      throw Error(error);

    });

  }).catch(function (error) {

    utils.logData(`${logFileName}${logFuncName} shared.db.getBookingDetails Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
    throw Error(error);

  });
}

export {
  mutationResolvers
};
