export const removeCardGQLTAG = `mutation stripeRemoveCard($customerId: String!, $cardId: String!) {
    stripeRemoveCard(customerId: $customerId, cardId: $cardId) {
      data
    }
  }`;

/*
{
  "customerId": "cus_FsNbPK6tMGOdDq",
  "cardId": "card_1FMdBYAZeKBPGDhHWiVXNGKE"
}
*/