export const updateIsEmailVerifiedYnGQLTAG = `mutation updateIsEmailVerifiedYn(
  $customerId: String!
  $isEmailVerifiedYn: Boolean
) {
  updateCustomerProfileByCustomerId(
    input: {
      customerId: $customerId
      customerProfilePatch: { isEmailVerifiedYn: $isEmailVerifiedYn }
    }
  ) {
    customerProfile {
      isEmailVerifiedYn
    }
  }
}`

/*
{
  "customerId":"",
  "isEmailVerifiedYn"
}
*/