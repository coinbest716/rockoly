export const updateScreensGQLTAG = `mutation updateRegistrationFlag(
    $customerId: String!
    $customerUpdatedScreens: [String]
  ) {
    updateCustomerProfileByCustomerId(
      input: {
        customerId: $customerId
        customerProfilePatch: {
          customerUpdatedScreens: $customerUpdatedScreens
        }
      }
    ) {
      customerProfile {
        customerUpdatedScreens
      }
    }
  }`

  /*{
  "customerId": "",
  "customerUpdatedScreens": ""
} */