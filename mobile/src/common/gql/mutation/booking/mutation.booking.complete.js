export const completeGQLTAG = `mutation bookingComplete(
    $bookingHistId: String!
    $chefId: String!
    $chefStripeUserId: String!
  ) {
    bookingComplete(
      bookingHistId: $bookingHistId
      chefId: $chefId
      chefStripeUserId: $chefStripeUserId
    ) {
      data
    }
  }
 `

  /*
  {
    "chefId":"9f749de7-dbc7-47f4-92d3-9c013e1788cf",
    "bookingHistId":"c1aa25be-fca3-4b2f-834d-16a84aacf6d3",
    "chefStripeUserId":"acct_1Fc5WuBotB53egdF"
  } */