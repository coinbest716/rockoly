export const byChefIdGQLTAG =`subscription bankTransferHistory($chefId: String!) {
    bankTransferHistory(chefId: $chefId) {
      data
    }
  }`