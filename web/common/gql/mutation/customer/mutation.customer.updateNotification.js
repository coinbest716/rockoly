export const updateNotificationGQLTAG = `mutation updateCustomerProfileByCustomerId(
    $customerId: String!
    $isNotificationYn: Boolean
  ) {
    updateCustomerProfileByCustomerId(
      input: {
        customerId: $customerId
        customerProfilePatch: { isNotificationYn: $isNotificationYn }
      }
    ) {
      customerProfile {
        isNotificationYn
      }
    }
  }
  `

  /*
  {
  "customerId": "",
  "isNotificationYn":  true 
} */