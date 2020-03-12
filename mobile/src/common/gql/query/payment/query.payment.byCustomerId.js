export const paymentByCustomerIdGQLTAG = `query allPaymentHistories(
  $paymentDoneByCustomerId: String!
  $first: Int
  $offset: Int
) {
  allPaymentHistories(
    orderBy: CREATED_AT_DESC
    first: $first
    offset: $offset
    filter: { paymentDoneByCustomerId: { eq: $paymentDoneByCustomerId } }
  ) {
    nodes {
      paymentHistId
      bookingHistId
      paymentId
      paymentStripeCustomerId
      paymentCardId
      paymentOrderId
      paymentType
      bookingHistId
      paymentTransactionId
      paymentStatusId
      paymentMethod
      paymentActualAmount
      paymentTotalAmountUnit
      paymentReceiptUrl
      paymentDoneByCustomerId
      paymentDoneForChefId
      paymentOriginalPriceValueFormat
      paymentOriginalPriceUnitFormat
      createdAt
      chefBookingHistoryByBookingHistId {
        chefBookingHistId
        chefBookingFromTime
        chefBookingToTime
        chefBookingStatusId
        paymentHistId
        chefBookingPriceValue
        chefBookingPriceUnit
        chefBookingServiceChargePriceValue
        chefBookingServiceChargePriceUnit
        chefBookingCommissionPriceValue
        chefBookingCommissionPriceUnit
        chefBookingTotalPriceValue
        chefBookingTotalPriceUnit
      }
      customerProfileByPaymentDoneByCustomerId {
        customerId
        fullName
        customerPicId
      }
      chefProfileByPaymentDoneForChefId {
        chefId
        fullName
        chefPicId
        chefProfileExtendedsByChefId {
          nodes {
            chefLocationAddress
            chefCity
          }
        }
      }
    }
  }
}
`;

/*
{
  "paymentDoneByCustomerId": "",
  "first": 1,
  "offset": 2
}
*/
