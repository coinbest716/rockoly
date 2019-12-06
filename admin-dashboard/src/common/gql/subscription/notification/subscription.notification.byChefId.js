export const byChefIdGQLTAG = `subscription notificationHistory($chefId: String!) {
    notificationHistory(chefId: $chefId) {
      data
    }
  }`