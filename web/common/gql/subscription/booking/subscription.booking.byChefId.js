export const byChefIdGQLTAG = `subscription chefBookingHistory($chefId: String!) {
    chefBookingHistory(chefId: $chefId) {
      data
    }
  }`