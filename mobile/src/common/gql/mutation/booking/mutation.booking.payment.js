export const paymentGQLTAG = `mutation bookingPayment(
    $stripeCustomerId: String!
    $cardId: String!
    $bookingHistId: String!
    $chefId: String!
    $price: Float!
    $currecy: String!
  ) {
    bookingPaymentTest(
      stripeCustomerId: $stripeCustomerId
      cardId: $cardId
      bookingHistId: $bookingHistId
      chefId: $chefId
      price: $price
      currecy: $currecy
    ) {
      data
    }
  }`

/*
{
"stripeCustomerId":"cus_G81Ncl2ZEC44Tb",
"cardId":"card_1FblL6AZeKBPGDhHCYi75KRV",
"bookingHistId": "5b90f1ec-2fa1-4052-bf95-069b3303a25c",
"chefId": "9f749de7-dbc7-47f4-92d3-9c013e1788cf",
"price": 10,
"currecy": "USD"
}
*/