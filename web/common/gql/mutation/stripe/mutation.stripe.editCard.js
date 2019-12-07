export const editCardGQLTAG = `mutation stripeEditCard(
    $customerId: String!
    $cardId: String!
    $name: String!
    $addressCity: String
    $addressCountry: String
    $addressLine1: String
    $addressLine2: String
    $addressState: String
    $addressZip: String
    $expMonth: Int!
    $expYear: Int!
  ) {
    stripeEditCard(
      customerId: $customerId
      cardId: $cardId
      name: $name
      addressCity: $addressCity
      addressCountry: $addressCountry
      addressLine1: $addressLine1
      addressLine2: $addressLine2
      addressState: $addressState
      addressZip: $addressZip
      expMonth: $expMonth
      expYear: $expYear
    ) {
      data
    }
  }`;

  /*
  {
  "customerId": "cus_FsNbPK6tMGOdDq",
  "cardId": "card_1FMdaRAZeKBPGDhHdZoBBBVz",
  "name": "Naaziya",
  "addressCity": "Salem",
  "addressCountry": "INDIA",
  "addressLine1": "Nehru Street",
  "addressLine2": "Old Suarmangalam",
  "addressState": "Tamil Nadu",
  "addressZip": "636005",
  "expMonth": 10,
  "expYear": 2024
}
  */