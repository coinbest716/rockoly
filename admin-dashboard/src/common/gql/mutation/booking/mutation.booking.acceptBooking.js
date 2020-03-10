export const acceptBookingGQLTAG = `# Write your query or mutation here
mutation updateChefBookingHistoryByChefBookingHistId(
  $chefBookingHistId: String!
  $chefBookingStatusId: String
  $chefBookingBlockFromTime: Datetime!
  $chefBookingBlockToTime: Datetime!
) {
  updateChefBookingHistoryByChefBookingHistId(
    input: {
      chefBookingHistId: $chefBookingHistId
      chefBookingHistoryPatch: {
        chefBookingStatusId: $chefBookingStatusId
        chefBookingBlockFromTime: $chefBookingBlockFromTime
        chefBookingBlockToTime: $chefBookingBlockToTime
      }
    }
  ) {
    chefBookingHistory {
      chefBookingHistId
      chefId
      customerId
      chefBookingFromTime
      chefBookingToTime
      chefBookingBlockFromTime
      chefBookingBlockToTime
    }
  }
}`;

/*
{
  "chefBookingHistId": "",
  "chefBookingStatusId":,
  "chefBookingBlockFromTime":"2019-11-10 11:00:00",
  "chefBookingBlockToTime":"2019-11-10 12:00:00",
}
*/