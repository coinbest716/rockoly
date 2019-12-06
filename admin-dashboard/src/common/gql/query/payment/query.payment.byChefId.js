export const paymentByChefIdGQLTAG = `query allBankTransferHistories($chefId: String!, $first: Int, $offset: Int) {
  allBankTransferHistories(
    orderBy:CREATED_AT_DESC
    first: $first
    offset: $offset
    filter: { chefId: { eq: $chefId } }
  ) {
    nodes {
      bankTransferHistId
      bankTransferAmt
      bankTransferAmtCurrency
      bookingHistId
      adminId
      chefId
      chefStripeUserId
      createdAt
      customerDetails {
        totalCount
        nodes {
          customerId
          fullName
          customerPicId
          customerProfileExtendedsByCustomerId{
            nodes{
              customerLocationAddress
            }
          }
        }
      }
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
        chefProfileByChefId {
          fullName
          chefPicId
        }
      }
    }
  }
}
`;

/*{
  "chefId": "",
  "first": 1,
  "offset": 2
}*/
