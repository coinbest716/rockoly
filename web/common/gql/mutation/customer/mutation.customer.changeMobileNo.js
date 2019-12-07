export const changeMobileNoGQLTag = `mutation updateCustomerProfileByCustomerId(
  $customerId: String!
  $customerMobileNumber: String!
) {
  updateCustomerProfileByCustomerId(
    input: {
      customerId: $customerId
      customerProfilePatch: { customerMobileNumber: $customerMobileNumber }
    }
  ) {
    customerProfile {
      customerId
      fullName
      customerMobileNumber
    }
  }
}
`;

/*
{
 "customerMobileNumber":"111111111",
 "customerId": "07fe580f-416c-4125-b6a3-6a0aa589a1ad"
}
*/