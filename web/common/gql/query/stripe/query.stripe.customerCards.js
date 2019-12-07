export const customerCardsGQLTAG = `query stripeGetCustomerCards(
    $customerId: String!
    $limit: Int!
  ) {
    stripeGetCustomerCards(
      customerId: $customerId
      limit: $limit
    ) {
      data
    }
  }`;


/*
{
  "customerId":"cus_FsE3cd7FxvBhKt",
  "limit": 10
}
*/