export const createRequestGQLTAG = `mutation createChefBookingRequestHistory(
  $bookingHistId: String!
  $chefId: String!
  $customerId: String!
  $chefBookingRequestNoOfPeople: Int
  $chefBookingRequestComplexity: Float
  $chefBookingRequestAdditionalServices: JSON
  $chefBookingRequestStripeCommissionPriceUnit: String
  $chefBookingRequestStripeCommissionPriceValue: Float
  $chefBookingRequestCommissionPriceUnit: String
  $chefBookingRequestCommissionPriceValue: Float
  $chefBookingRequestServiceChargePriceUnit: String
  $chefBookingRequestServiceChargePriceValue: Float
  $chefBookingRequestPriceValue: Float
	$chefBookingRequestPriceUnit: String
  $chefBookingRequestTotalPriceValue: Float
  $chefBookingRequestTotalPriceUnit: String
) {
  createChefBookingRequestHistory(
    input: {
      chefBookingRequestHistory: {
        bookingHistId: $bookingHistId
        chefId: $chefId
        customerId: $customerId
        chefBookingRequestNoOfPeople: $chefBookingRequestNoOfPeople
        chefBookingRequestComplexity: $chefBookingRequestComplexity
        chefBookingRequestAdditionalServices: $chefBookingRequestAdditionalServices
        chefBookingRequestStripeCommissionPriceUnit: $chefBookingRequestStripeCommissionPriceUnit
        chefBookingRequestStripeCommissionPriceValue: $chefBookingRequestStripeCommissionPriceValue
        chefBookingRequestCommissionPriceUnit: $chefBookingRequestCommissionPriceUnit
        chefBookingRequestCommissionPriceValue: $chefBookingRequestCommissionPriceValue
        chefBookingRequestServiceChargePriceUnit: $chefBookingRequestServiceChargePriceUnit
        chefBookingRequestServiceChargePriceValue: $chefBookingRequestServiceChargePriceValue
        chefBookingRequestPriceValue:$chefBookingRequestPriceValue
        chefBookingRequestPriceUnit:$chefBookingRequestPriceUnit
        chefBookingRequestTotalPriceValue: $chefBookingRequestTotalPriceValue
        chefBookingRequestTotalPriceUnit: $chefBookingRequestTotalPriceUnit
      }
    }
  ) {
    chefBookingRequestHistory {
      chefBookingRequestHistId
      bookingHistId
      chefId
      customerId
      chefBookingRequestNoOfPeople
      chefBookingRequestComplexity
      chefBookingRequestAdditionalServices
      chefBookingRequestStripeCommissionPriceUnit
      chefBookingRequestStripeCommissionPriceValue
      chefBookingRequestCommissionPriceUnit
      chefBookingRequestCommissionPriceValue
      chefBookingRequestServiceChargePriceUnit
      chefBookingRequestServiceChargePriceValue
      chefBookingRequestPriceValue
      chefBookingRequestPriceUnit
      chefBookingRequestTotalPriceUnit
      chefBookingRequestTotalPriceValue
    }
  }
}
`