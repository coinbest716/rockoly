export const updateCustomerProfilePicGQLTAG = `mutation updateCustomerProfilePic(
    $customerId: String!
    $customerPicId: String
  ) {
    updateCustomerProfileByCustomerId(
      input: {
        customerId: $customerId
        customerProfilePatch: { customerPicId: $customerPicId }
      }
    ) {
      customerProfile {
        customerPicId
      }
    }
  }
  `


  /*
  {
   "customerId": ""
} */