export const updateIsMobileNoVerifiedYnGQLTAG = `mutation updateIsMobileNoVerifiedYn(
  $customerId: String!
  $isMobileNoVerifiedYn: Boolean
) {
  updateCustomerProfileByCustomerId(
    input: {
      customerId: $customerId
      customerProfilePatch: { isMobileNoVerifiedYn: $isMobileNoVerifiedYn }
    }
  ) {
    customerProfile {
      isMobileNoVerifiedYn
    }
  }
}`

/*
{
  "customerId":"",
  "isMobileNoVerifiedYn"
}
*/