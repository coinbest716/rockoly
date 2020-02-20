import {
  db
} from '../db';
import * as utils from '../utils';

let logFileName = 'src/shared/shared.db.js';

// update stripe customer id for chef
export function updateStripeCustomerIdForChef(chefId, stripeCustomerId) {

  let logFuncName = 'updateStripeCustomerIdForChef';
  utils.logData(`${logFileName}${logFuncName} chefId: ${chefId} , stripeCustomerId:${stripeCustomerId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `update chef_profile_extended 
        set chef_stripe_customer_id = $2
        where chef_id = $1 and chef_stripe_customer_id isnull  Returning chef_stripe_customer_id
      `;

      await db.one(sqlStr, [chefId, stripeCustomerId]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

// update stripe customer id for chef
export function updateStripeCustomerIdForCustomer(customerId, stripeCustomerId) {

  let logFuncName = 'updateStripeCustomerIdForCustomer';
  utils.logData(`${logFileName}${logFuncName} customerId: ${customerId} , stripeCustomerId:${stripeCustomerId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `update customer_profile_extended 
          set customer_stripe_customer_id = $2
          where customer_id = $1 and customer_stripe_customer_id isnull  Returning customer_stripe_customer_id
        `;

      await db.one(sqlStr, [customerId, stripeCustomerId]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

// admin authenticate
export function authenticate(payload, roleType) {

  let logFuncName = 'authenticate';
  let dbFunc = null;

  utils.logData(`${logFileName}${logFuncName} Payload: ${JSON.stringify(payload)}, RoleType: ${roleType} `, utils.LOGLEVELS.INFO);

  if (roleType == 'CUSTOMER') {
    dbFunc = 'private.sso_authenticate_customer';
  } else if (roleType == 'ADMIN') {
    dbFunc = 'private.sso_authenticate_admin';
  } else if (roleType == 'CHEF') {
    dbFunc = 'private.sso_authenticate_chef';
  }

  const executor = async function (resolve, reject) {
    try {

      await db.proc(`${dbFunc}`, [payload]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db ${dbFunc}: Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);

        if (roleType == 'CUSTOMER') {
          resolve({
            data: data.sso_authenticate_customer
          });
        } else if (roleType == 'ADMIN') {
          resolve({
            data: data.sso_authenticate_admin
          });
        } else if (roleType == 'CHEF') {
          resolve({
            data: data.sso_authenticate_chef
          });
        }

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db ${dbFunc}: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error.message);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error.message);

    }
  };

  return new Promise(executor);
}

// update stripe customer_id
export function updateStripeCustomerId(payload) {

  let logFuncName = 'updateStripeCustomerId';

  utils.logData(`${logFileName}${logFuncName} Payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      await db.proc('private.update_stripe_customer_id', [payload.email, payload.stripeCustomerId]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);

        resolve({
          data: data
        });

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db: Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

// get device token
export function getDeviceToken(userId) {

  let logFuncName = 'getDeviceToken';
  utils.logData(`${logFileName}${logFuncName} userId: ${userId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = 'select array_agg(distinct user_device_token) as device_token from user_device_tokens where user_id = $1';

      await db.one(sqlStr, [userId]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

// create booking
export function createBooking(payload) {

  let logFuncName = 'createBooking';
  utils.logData(`${logFileName}${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `insert into chef_booking_history(
        chef_id, 
        customer_id, 
        chef_booking_from_time,
        chef_booking_to_time,
        chef_booking_price_value, 
        chef_booking_price_unit,
        chef_booking_service_charge_price_value,
        chef_booking_service_charge_price_unit,
        chef_booking_commission_price_value,
        chef_booking_commission_price_unit,
        chef_booking_total_price_value,
        chef_booking_total_price_unit,
        chef_booking_dish_type_id,
        chef_booking_summary,
        chef_booking_allergy_type_id,
        chef_booking_other_allergy_types,
        chef_booking_dietary_restrictions_type_id,
        chef_booking_other_dietary_restrictions_types,
        chef_booking_kitchen_equipment_type_id,
        chef_booking_other_kitchen_equipment_types,
        chef_booking_store_type_id,
        chef_booking_other_store_types,
        chef_booking_no_of_people,
        chef_booking_complexity,
        chef_booking_additional_services,
        chef_booking_location_address,
        chef_booking_location_lat,
        chef_booking_location_lng,
        chef_booking_addr_line_1,
        chef_booking_addr_line_2,
        chef_booking_state,
        chef_booking_country,
        chef_booking_city,
        chef_booking_postal_code
        ) values (
          $1, 
          $2, 
          $3, 
          $4, 
          $5, 
          $6, 
          $7, 
          $8 , 
          $9 , 
          $10 , 
          $11 , 
          $12 , 
          $13 ,
          $14 ,
          $15 ,
          $16 ,
          $17 ,
          $18 ,
          $19 ,
          $20 ,
          $21 ,
          $22 ,
          $23 ,
          $24 ,
          $25 ,
          $26 ,
          $27 ,
          $28 ,
          $29 ,
          $30 ,
          $31 ,
          $32 ,
          $33 ,
          $34
          ) RETURNING *`;

      let variables = [
        payload.chefId,
        payload.customerId,
        payload.fromTime,
        payload.toTime,
        payload.bookingPrice,
        payload.bookingCurrency,
        payload.servicePrice,
        payload.serviceCurrency,
        payload.commissionPrice,
        payload.commissionCurrency,
        payload.totalPrice,
        payload.totalPriceCurrency,
        payload.dishTypeId,
        payload.summary,
        payload.allergyTypeIds,
        payload.otherAllergyTypes,
        payload.dietaryRestrictionsTypesIds,
        payload.otherDietaryRestrictionsTypes,
        payload.kitchenEquipmentTypeIds,
        payload.otherKitchenEquipmentTypes,
        payload.storeTypeIds,
        payload.otherStoreTypes,
        payload.noOfGuests,
        payload.complexity,
        payload.additionalServices,
        payload.locationAddress,
        payload.locationLat,
        payload.locationLng,
        payload.addrLine1,
        payload.addrLine2,
        payload.state,
        payload.country,
        payload.city,
        payload.postalCode
      ];

      await db.one(sqlStr, variables).then(async function (data) {

        utils.logData(`${logFileName} ${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName} ${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);

}


// create booking
export function createBookingTest(payload) {

  let logFuncName = 'createBookingTest';
  utils.logData(`${logFileName}${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `insert into chef_booking_history(
        chef_id, 
        customer_id, 
        chef_booking_from_time,
        chef_booking_to_time,
        chef_booking_price_value, 
        chef_booking_price_unit,
        chef_booking_service_charge_price_value,
        chef_booking_service_charge_price_unit,
        chef_booking_commission_price_value,
        chef_booking_commission_price_unit,
        chef_booking_stripe_commission_price_value,
        chef_booking_stripe_commission_price_unit,
        chef_booking_total_price_value,
        chef_booking_total_price_unit,
        chef_booking_dish_type_id,
        chef_booking_summary,
        chef_booking_allergy_type_id,
        chef_booking_other_allergy_types,
        chef_booking_dietary_restrictions_type_id,
        chef_booking_other_dietary_restrictions_types,
        chef_booking_kitchen_equipment_type_id,
        chef_booking_other_kitchen_equipment_types,
        chef_booking_store_type_id,
        chef_booking_other_store_types,
        chef_booking_no_of_people,
        chef_booking_complexity,
        chef_booking_additional_services,
        chef_booking_location_address,
        chef_booking_location_lat,
        chef_booking_location_lng,
        chef_booking_addr_line_1,
        chef_booking_addr_line_2,
        chef_booking_state,
        chef_booking_country,
        chef_booking_city,
        chef_booking_postal_code
        ) values (
          $1, 
          $2, 
          $3, 
          $4, 
          $5, 
          $6, 
          $7, 
          $8 , 
          $9 , 
          $10 , 
          $11 , 
          $12 , 
          $13 ,
          $14 ,
          $15 ,
          $16 ,
          $17 ,
          $18 ,
          $19 ,
          $20 ,
          $21 ,
          $22 ,
          $23 ,
          $24 ,
          $25 ,
          $26 ,
          $27 ,
          $28 ,
          $29 ,
          $30 ,
          $31 ,
          $32 ,
          $33 ,
          $34 ,
          $35 ,
          $36 
          ) RETURNING *`;

      let variables = [
        payload.chefId,
        payload.customerId,
        payload.fromTime,
        payload.toTime,
        payload.bookingPrice,
        payload.bookingCurrency,
        payload.servicePrice,
        payload.serviceCurrency,
        payload.commissionPrice,
        payload.commissionCurrency,
        payload.stripeCommissionPrice,
        payload.stripeCommissionCurrency,
        payload.totalPrice,
        payload.totalPriceCurrency,
        payload.dishTypeId,
        payload.summary,
        payload.allergyTypeIds,
        payload.otherAllergyTypes,
        payload.dietaryRestrictionsTypesIds,
        payload.otherDietaryRestrictionsTypes,
        payload.kitchenEquipmentTypeIds,
        payload.otherKitchenEquipmentTypes,
        payload.storeTypeIds,
        payload.otherStoreTypes,
        payload.noOfGuests,
        payload.complexity,
        payload.additionalServices,
        payload.locationAddress,
        payload.locationLat,
        payload.locationLng,
        payload.addrLine1,
        payload.addrLine2,
        payload.state,
        payload.country,
        payload.city,
        payload.postalCode
      ];

      await db.one(sqlStr, variables).then(async function (data) {

        utils.logData(`${logFileName} ${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName} ${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);

}

// update booking
export function updateBooking(payload) {

  let logFuncName = 'updateBooking';
  utils.logData(`${logFileName}${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `update chef_booking_history
      set chef_id= $1,
          customer_id= $2,
          chef_booking_from_time= $3,
          chef_booking_to_time= $4,
          chef_booking_price_value= $5,
          chef_booking_price_unit= $6,
          chef_booking_service_charge_price_value= $7,
          chef_booking_service_charge_price_unit= $8,
          chef_booking_commission_price_value= $9,
          chef_booking_commission_price_unit= $10,
          chef_booking_stripe_commission_price_value= $11,
          chef_booking_stripe_commission_price_unit= $12,
          chef_booking_total_price_value= $13,
          chef_booking_total_price_unit= $14,
          chef_booking_dish_type_id= $15,
          chef_booking_summary= $16,
          chef_booking_allergy_type_id= $17,
          chef_booking_other_allergy_types= $18,
          chef_booking_dietary_restrictions_type_id= $19,
          chef_booking_other_dietary_restrictions_types= $20,
          chef_booking_kitchen_equipment_type_id= $21,
          chef_booking_other_kitchen_equipment_types= $22,
          chef_booking_store_type_id= $23,
          chef_booking_other_store_types= $24,
          chef_booking_no_of_people= $25,
          chef_booking_complexity= $26,
          chef_booking_additional_services= $27,
          chef_booking_location_address= $28,
          chef_booking_location_lat= $29,
          chef_booking_location_lng= $30,
          chef_booking_addr_line_1= $31,
          chef_booking_addr_line_2= $32,
          chef_booking_state= $33,
          chef_booking_country= $34,
          chef_booking_city= $35,
          chef_booking_postal_code= $36
      where chef_booking_hist_id = $37
        and chef_booking_status_id = 'PAYMENT_PENDING'
      RETURNING *`;

      let variables = [
        payload.chefId,
        payload.customerId,
        payload.fromTime,
        payload.toTime,
        payload.bookingPrice,
        payload.bookingCurrency,
        payload.servicePrice,
        payload.serviceCurrency,
        payload.commissionPrice,
        payload.commissionCurrency,
        payload.stripeCommissionPrice,
        payload.stripeCommissionCurrency,
        payload.totalPrice,
        payload.totalPriceCurrency,
        payload.dishTypeId,
        payload.summary,
        payload.allergyTypeIds,
        payload.otherAllergyTypes,
        payload.dietaryRestrictionsTypesIds,
        payload.otherDietaryRestrictionsTypes,
        payload.kitchenEquipmentTypeIds,
        payload.otherKitchenEquipmentTypes,
        payload.storeTypeIds,
        payload.otherStoreTypes,
        payload.noOfGuests,
        payload.complexity,
        payload.additionalServices,
        payload.locationAddress,
        payload.locationLat,
        payload.locationLng,
        payload.addrLine1,
        payload.addrLine2,
        payload.state,
        payload.country,
        payload.city,
        payload.postalCode,
        payload.bookingHistId
      ];

      await db.one(sqlStr, variables).then(async function (data) {

        utils.logData(`${logFileName} ${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName} ${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);

}

// create notes
export function insertNotes(payload) {

  let logFuncName = 'insertNotes';

  utils.logData(`${logFileName} ${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `insert into notes_history(
        chef_id,
        customer_id,
        notes_description,
        table_name,
        table_pk_id)values ($1, $2, $3, $4, $5) RETURNING notes_hist_id`;

      let variables = [
        payload.chefId,
        payload.customerId,
        payload.notes_description,
        payload.table_name,
        payload.table_pk_id
      ];

      await db.one(sqlStr, variables).then(async function (data) {

        utils.logData(`${logFileName} ${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName} ${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);

}

//  insert into payment history 
export function insertPayment(payload) {

  let logFuncName = 'insertPayment';
  utils.logData(`${logFileName}${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `insert into payment_history(
        booking_hist_id,
        payment_id,
        payment_stripe_customer_id,
        payment_card_id,
        payment_order_id,
        payment_transaction_id,
        payment_status_id,
        payment_method,
        payment_actual_amount,
        payment_actual_amount_unit,
        payment_total_amount,
        payment_total_amount_unit,
        payment_receipt_url,
        payment_data_as_json,
        payment_done_by_customer_id,
        payment_done_for_chef_id,
        payment_done_for_type,
        payment_original_price_value_format,
        payment_original_price_unit_format
        ) values ($1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16,
          $17,
          $18,
          $19
          ) RETURNING *`;

      let variables = [
        payload.bookingHistId,
        payload.paymentId,
        payload.paymentStripeCustomerId,
        payload.paymentCardId,
        payload.paymentOrderId,
        payload.paymentTransactionId,
        payload.paymentStatusId,
        payload.paymentMethod,
        payload.paymentActualAmount,
        payload.paymentActualAmountUnit,
        payload.paymentTotalAmount,
        payload.paymentTotalAmountUnit,
        payload.paymentReceiptUrl,
        payload.paymentDataAsJson,
        payload.paymentDoneByCustomerId,
        payload.paymentDoneForChefId,
        payload.paymentDoneForType,
        payload.paymentOriginalPriceValueFormat,
        payload.paymentOriginalPriceUnitFormat
      ];

      await db.one(sqlStr, variables).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);

}

//  insert into bank_transfer_history 
export function insertBankTransfer(payload) {

  let logFuncName = 'insertBankTransfer';

  utils.logData(`${logFileName}${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `insert into bank_transfer_history(
        bank_transfer_amt,
        bank_transfer_amt_currency,
        booking_hist_id,
        admin_id,
        chef_id,
        chef_stripe_user_id,
        chef_data_as_json)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

      let variables = [
        payload.amt,
        payload.amtCurrency,
        payload.bookingHistId,
        payload.adminId,
        payload.chefId,
        payload.chefStripeUserId,
        payload.dataAsJson
      ];

      await db.one(sqlStr, variables).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);

}

//  insert into chef_bank_profile 
export function insertChefBankDetails(payload) {

  let logFuncName = 'insertChefBankDetails';

  utils.logData(`${logFileName} ${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `insert into chef_bank_profile(
        chef_access_token,
        chef_livemode,
        chef_refresh_token,
        chef_token_type,
        chef_stripe_publishable_key,
        chef_stripe_user_id,
        chef_scope,
        chef_id,
        chef_data_as_json)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

      let variables = [
        payload.access_token,
        payload.livemode,
        payload.refresh_token,
        payload.token_type,
        payload.stripe_publishable_key,
        payload.stripe_user_id,
        payload.scope,
        payload.chefId,
        payload
      ];

      await db.one(sqlStr, variables).then(async function (data) {

        utils.logData(`${logFileName} ${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName} ${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);

}

//  insert into refund_history 
export function insertRefundPayment(payload) {

  let logFuncName = 'insertRefundPayment';

  utils.logData(`${logFileName}${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `insert into refund_history (
        customer_id, 
        payment_hist_id,
        booking_hist_id, 
        charge_id, 
        refund_id, 
        refund_data_as_json
      ) values($1,$2,$3,$4,$5,$6) RETURNING *`;

      let variables = [
        payload.customerId,
        payload.paymentHistId,
        payload.bookingHistId,
        payload.chargeId,
        payload.refundId,
        payload.dataAsJson
      ];

      await db.one(sqlStr, variables).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);

}

// remove chef bank details
export function removeChefBankDetails(chefId, accountId) {

  let logFuncName = 'removeChefBankDetails';

  utils.logData(`${logFileName}${logFuncName} chefId: ${chefId}, accountId: ${accountId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = 'delete from chef_bank_profile where chef_id = $1 and chef_stripe_user_id=$2 Returning *';

      await db.one(sqlStr, [chefId, accountId]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

// get chef bank details
export function getChefBankDetails(chefId) {

  let logFuncName = 'getChefBankDetails';

  utils.logData(`${logFileName}${logFuncName} chefId: ${chefId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `select json_agg(json_build_object(
        'chef_bank_profile_id',chef_bank_profile_id,
        'chef_stripe_user_id',chef_stripe_user_id,
        'is_default_yn',is_default_yn
        )) as chef_bank_details  from chef_bank_profile cbp where chef_id = $1`;

      await db.one(sqlStr, [chefId]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

// get price from
export function getChefBookingPrice(payload) {

  let logFuncName = 'getChefBookingPrice';

  utils.logData(`${logFileName} ${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `select calculate_booking_price_by_params($1) as booking_price ,get_setting_value('BOOKING_SERVICE_CHARGE_IN_PERCENTAGE') as service_charge`;

      await db.one(sqlStr, [payload]).then(async function (data) {

        utils.logData(`${logFileName} ${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName} ${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

export function getChefBookingPriceTest(payload) {

  let logFuncName = 'getChefBookingPriceTest';

  utils.logData(`${logFileName} ${logFuncName} payload: ${JSON.stringify(payload)} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = `select calculate_booking_price_by_params($1) as booking_price , get_setting_value('BOOKING_SERVICE_CHARGE_IN_PERCENTAGE') as service_charge, calculate_stripe_service_for_booking($1) as stripe_service_charge`;

      await db.one(sqlStr, [payload]).then(async function (data) {

        utils.logData(`${logFileName} ${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName} ${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

// get booking details
export function getBookingDetails(bookingHistId) {

  let logFuncName = 'getBookingDetails';

  utils.logData(`${logFileName}${logFuncName} bookingHistId: ${bookingHistId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = 'select *,chef_booking_history_payment_hist_ids(cbh) as payment_hist_ids from chef_booking_history cbh where chef_booking_hist_id = $1';

      await db.one(sqlStr, [bookingHistId]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

// get booking payment details
export function getBookingPaymentDetails(paymentHistId) {

  let logFuncName = 'getBookingPaymentDetails';

  utils.logData(`${logFileName} ${logFuncName} paymentHistId: ${paymentHistId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = 'select * from payment_history where payment_hist_id = $1';

      await db.one(sqlStr, [paymentHistId]).then(async function (data) {

        utils.logData(`${logFileName} ${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName} ${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}

// Update booking status
export function updateBookingStatus(bookingHistId, statusId) {

  let logFuncName = 'updateBookingStatus';

  utils.logData(`${logFileName}${logFuncName} bookingHistId: ${bookingHistId} , statusId: ${statusId} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = null;

      if (statusId == 'AMOUNT_TRANSFER_FAILED') {

        sqlStr = `Update chef_booking_history
        set 
          chef_booking_status_id = $2
        where 
          chef_booking_hist_id = $1 and 
          trim(chef_booking_status_id) in ('COMPLETED','AMOUNT_TRANSFER_FAILED')
        RETURNING * ; `;

      } else if (statusId == 'AMOUNT_TRANSFER_SUCCESS') {

        sqlStr = `Update chef_booking_history
        set 
          chef_booking_status_id = $2
        where 
          chef_booking_hist_id = $1 and 
          trim(chef_booking_status_id) in ('COMPLETED','AMOUNT_TRANSFER_FAILED')
        RETURNING *; `;

      } else if (statusId == 'PAYMENT_FAILED') {

        sqlStr = `Update chef_booking_history
        set 
          chef_booking_status_id = $2
        where 
          chef_booking_hist_id = $1 and 
          trim(chef_booking_status_id) in ('PAYMENT_PENDING','PAYMENT_FAILED') 
        RETURNING *; `;

      } else if (statusId == 'COMPLETED') {

        sqlStr = `Update chef_booking_history
        set 
          chef_booking_status_id = $2
        where 
          chef_booking_status_id = 'CHEF_ACCEPTED' and 
          chef_booking_hist_id = $1 
        RETURNING *; `;

      } else if (statusId == 'REFUND_AMOUNT_FAILED') {

        sqlStr = `Update chef_booking_history
        set 
          chef_booking_status_id = $2
        where 
          chef_booking_status_id in ('CHEF_REJECTED','COMPLETED','CANCELLED_BY_CHEF','CANCELLED_BY_CUSTOMER','REFUND_AMOUNT_FAILED') and 
          chef_booking_hist_id = $1 
        RETURNING *; `;

      }

      await db.one(sqlStr, [bookingHistId, statusId]).then(async function (data) {

        utils.logData(`${logFileName} ${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName} ${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName} ${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}


// checkIfUserBlocked
export function checkIfUserBlocked(id, role) {

  let logFuncName = 'checkIfUserBlocked';

  utils.logData(`${logFileName} ${logFuncName} id: ${id} , role: ${role} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = 'select * from check_if_user_blocked($1,$2)';

      await db.one(sqlStr, [id, role]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}


// getChefStripeUserId
export function getChefStripeUserId(id) {

  let logFuncName = 'getChefStripeUserId';

  utils.logData(`${logFileName} ${logFuncName} id: ${id} `, utils.LOGLEVELS.INFO);

  const executor = async function (resolve, reject) {
    try {

      let sqlStr = 'select chef_profile_default_stripe_user_id(cp) from chef_profile cp where chef_id=$1';

      await db.one(sqlStr, [id]).then(async function (data) {

        utils.logData(`${logFileName}${logFuncName} Db Result: ${JSON.stringify(data)}`, utils.LOGLEVELS.INFO);
        resolve(data);

      }).catch(function (error) {

        utils.logData(`${logFileName}${logFuncName} Db Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
        reject(error);

      });

    } catch (error) {

      utils.logData(`${logFileName}${logFuncName} Catch Error: ${JSON.stringify(error)}`, utils.LOGLEVELS.ERROR);
      reject(error);

    }
  };

  return new Promise(executor);
}