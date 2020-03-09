import { GetValueFromLocal } from './LocalStorage';
import { toastMessage, renderError } from './Toast';
import * as util from './checkEmptycondition';

export const chef = 'chef';
export const customer = 'customer';
export const CHEF = 'CHEF';
export const CUSTOMER = 'CUSTOMER';
export const chefId = 'chefId';
export const customerId = 'customerId';
export const specializationId = 'specializationId';
export const profileExtendId = 'profileExtendId';
export const customerProfileExtendedId = 'customerProfileExtendedId';
export const chefStatusId = 'chefStatusId';
export const customerPreferenceId = 'customerPreferenceId';

//get chef ids
export const getChefId = option => {
  try {
    return new Promise(function(resolve, reject) {
      let value = GetValueFromLocal('user_ids');
      value.then(res => {
        if (util.isObjectEmpty(res) && util.isStringEmpty(res.chefId)) {
          if (option === chefId) {
            resolve(res.chefId);
          } else if (option === specializationId) {
            resolve(res.chefSpecializationId);
          } else if (option === profileExtendId) {
            resolve(res.chefProfileExtendedId);
          } else if (option === chefStatusId) {
            resolve(res.chefStatusId);
          }
        }
      });
    });
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

export const getCustomerId = option => {
  try {
    return new Promise(function(resolve, reject) {
      let value = GetValueFromLocal('user_ids');

      value.then(res => {
        if (util.isObjectEmpty(res) && util.isStringEmpty(res.customerId)) {
          if (option === customerId) {
            resolve(res.customerId);
          } else if (option === customerProfileExtendedId) {
            resolve(res.customerProfileExtendedId);
          } else if (option === customerPreferenceId) {
            resolve(res.customerPreferenceId);
          }
        }
      });
    });
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

//get user type role
export const getUserTypeRole = () => {
  try {
    return new Promise(function(resolve, reject) {
      GetValueFromLocal('user_role').then(result => {
        resolve(result);
      });
    });
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

//get customer ids after authentication (login/register)
export const getCustomerAuthData = data => {
  try {
    return new Promise(function(resolve, reject) {
      if (
        data &&
        data.customer &&
        data.customer.customerId &&
        data.customer.customerProfileExtendedId &&
        data.customer.customerPreferenceId
      ) {
        let customerData = data.customer;
        const customerIds = {
          customerId: customerData.customerId,
          customerProfileExtendedId: customerData.customerProfileExtendedId,
          customerPreferenceId: customerData.customerPreferenceId,
        };
        resolve(customerIds);
      }
    });
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};

//get chef ids after authentication (login/register)
export const getChefAuthData = data => {
  try {
    return new Promise(function(resolve, reject) {
      if (
        data &&
        data.chef &&
        data.chef.chefId &&
        data.chef.chefProfileExtendedId &&
        data.chef.chefSpecializationId
      ) {
        let chefData = data.chef;
        const chefIds = {
          chefId: chefData.chefId,
          chefProfileExtendedId: chefData.chefProfileExtendedId,
          chefSpecializationId: chefData.chefSpecializationId,
        };
        resolve(chefIds);
      }
    });
  } catch (error) {
    toastMessage(renderError, error.message);
  }
};
