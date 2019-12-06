export const cardDetailsGQLTAG = `query stripeGetCardDetails($customerId: String!, $cardId: String!) {
    stripeGetCardDetails(customerId: $customerId, cardId: $cardId) {
      data
    }
  }`;


/*
  {
  "customerId":"cus_FsE3cd7FxvBhKt",
  "cardId": "card_1FMTcMAZeKBPGDhHQosbdITs"
}
*/