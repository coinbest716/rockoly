export const profileExtendedGQLTAG = `subscription chefProfileExtended($chefId: String) {
    chefProfileExtended(chefId: $chefId) {
      data
    }
  }
  `