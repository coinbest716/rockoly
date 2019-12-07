export const chefBookingHistoryGQLTAG = `subscription chefBookingHistory($chefBookingHistId: String!) {
    chefBookingHistory(chefBookingHistId: $chefBookingHistId) {
      data
    }
  }`