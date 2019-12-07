export const byCustomerIdGQLTAG = `subscription chefBookingHistory($customerId: String!) {
    chefBookingHistory(customerId: $customerId) {
      data
    }
  }`