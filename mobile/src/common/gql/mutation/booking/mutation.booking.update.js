export const updateGQLTAG = `mutation updateChefBookingHistoryByChefBookingHistId(
    $chefBookingHistId: String!
    $chefBookingStatusId: String
    $chefBookingCompletedByCustomerYn: Boolean
    $chefBookingCompletedByChefYn: Boolean
    $chefBookingChefRejectOrCancelReason: String
    $chefBookingCustomerRejectOrCancelReason: String
  ) {
    updateChefBookingHistoryByChefBookingHistId(
      input: {
        chefBookingHistId: $chefBookingHistId
        chefBookingHistoryPatch: {
          chefBookingStatusId: $chefBookingStatusId
          chefBookingCompletedByCustomerYn: $chefBookingCompletedByCustomerYn
          chefBookingCompletedByChefYn: $chefBookingCompletedByChefYn
          chefBookingChefRejectOrCancelReason: $chefBookingChefRejectOrCancelReason
          chefBookingCustomerRejectOrCancelReason: $chefBookingCustomerRejectOrCancelReason
        }
      }
    ) {
      chefBookingHistory {
        chefBookingHistId
        chefId
        customerId
        chefBookingFromTime
        chefBookingToTime
        chefBookingPriceValue
        chefBookingPriceUnit
        chefBookingStatusId
        chefBookingCompletedByCustomerYn
        chefBookingCompletedByChefYn
        chefBookingChefRejectOrCancelReason
        chefBookingCustomerRejectOrCancelReason
        createdAt
      }
    }
  }`;

/*
{
  "chefBookingHistId": "",
  "chefBookingStatusId": "CHEF_ACCEPTED / CHEF_REJECTED / CANCELLED_BY_CHEF / CANCELLED_BY_CUSTOMER  ",
  "chefBookingCompletedByCustomerYn":false (if customer mark as completed , then make it true),
  "chefBookingCompletedByChefYn":false  (if chef mark as completed , then make it true),
  "chefBookingChefRejectOrCancelReason":"",
  "chefBookingCustomerRejectOrCancelReason":""
}
*/