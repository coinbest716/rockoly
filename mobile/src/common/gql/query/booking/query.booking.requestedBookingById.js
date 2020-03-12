export const requestedBookingByIdGQLTAG = `query allChefBookingRequestHistories($bookingHistId: String!) {
  allChefBookingRequestHistories(
    filter: { bookingHistId: { eq: $bookingHistId } }
  ) {
    nodes {
      chefBookingRequestHistId
      bookingHistId
      chefId
      customerId
      chefBookingRequestNoOfPeople
      chefBookingRequestComplexity
      chefBookingRequestAdditionalServices
      additionalServiceDetails
      chefBookingRequestTotalPriceUnit
      chefBookingRequestTotalPriceValue
      createdAt
      updatedAt
      chefBookingRequestPriceValue
      chefBookingRequestPriceUnit
      chefBookingRequestServiceChargePriceValue
      chefBookingRequestServiceChargePriceUnit
      chefBookingRequestCommissionPriceValue
      chefBookingRequestCommissionPriceUnit
      chefBookingRequestStripeCommissionPriceValue
      chefBookingRequestStripeCommissionPriceUnit
    }
  }
}`
/*
  {
    "chefBookingHistId":"893e44ed-bec3-4fa4-88ce-416852e75d41"
  }
*/