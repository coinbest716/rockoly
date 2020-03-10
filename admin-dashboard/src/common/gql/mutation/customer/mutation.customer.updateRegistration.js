export const updateRegistrationGQLTAG = `mutation updateRegistrationFlag(
  $customerId: String!
  $isRegistrationCompletedYn: Boolean
) {
  updateCustomerProfileByCustomerId(
    input: {
      customerId: $customerId
      customerProfilePatch: {
        isRegistrationCompletedYn: $isRegistrationCompletedYn
      }
    }
  ) {
    customerProfile {
      isRegistrationCompletedYn
    }
  }
}

  `

  /*
 {
  "customerId": "1e2e76da-3526-4fac-8b65-f31f7b1fc5ea",
  "isRegistrationCompletedYn":  true 
} */