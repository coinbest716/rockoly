export const chargeCardGQLTAG = `mutation stripeChargeCard(
    $customerId: String!
    $cardId: String!
    $amount: Float!
    $unit: String!
  ) {
    stripeChargeCard(
      customerId: $customerId
      cardId: $cardId
      amount: $amount
      unit: $unit
    ) {
      data
    }
  }`;


/*
  {
  "customerId":"cus_Fw4XsFWDSXwGpK",
  "cardId":"card_1FQCOuAZeKBPGDhH1nTHJUeP",
  "amount": 100,
  "unit": "USD"
}
  */