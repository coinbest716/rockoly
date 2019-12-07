export const profileGQLTAG = `subscription customerProfile($customerId: String!) {
    customerProfile(customerId: $customerId) {
      data
    }
  }`