export const followChefGQLTAG = `subscription customerFollowChef($customerId: String!) {
    customerFollowChef(customerId: $customerId) {
      data
    }
  }`