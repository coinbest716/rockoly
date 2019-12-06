export const specializationGQLTAG = `subscription chefSpecializationProfile($chefId: String!) {
    chefSpecializationProfile(chefId: $chefId) {
      data
    }
  }`