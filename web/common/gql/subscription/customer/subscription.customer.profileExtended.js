export const profileExtendedGQLTAG = `subscription customerProfileExtended($customerId: String!) {
    customerProfileExtended(customerId: $customerId) {
      data
    }
  }`