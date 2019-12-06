export const byCustomerIdGQLTAG = `subscription notificationHistory($customerId: String!) {
    notificationHistory(customerId: $customerId) {
      data
    }
  }`