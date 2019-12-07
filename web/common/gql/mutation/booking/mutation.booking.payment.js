export const paymentGQLTAG = `mutation bookingPayment(
    $stripeCustomerId: String!
    $cardId: String!
    $bookingHistId: String!
  ) {
    bookingPayment(
      stripeCustomerId: $stripeCustomerId
      cardId: $cardId
      bookingHistId: $bookingHistId
    ) {
      data
    }
  }`

  /*{
"stripeCustomerId":"cus_G81Ncl2ZEC44Tb",
"cardId":"card_1FblL6AZeKBPGDhHCYi75KRV",
"bookingHistId": "51df4626-af79-4a96-a763-2c29ac4dc872"
} */