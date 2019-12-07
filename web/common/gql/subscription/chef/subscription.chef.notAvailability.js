export const notAvailabilityGQLTAG = `subscription chefNotAvailabilityProfile($chefId: String!) {
    chefNotAvailabilityProfile(chefId: $chefId) {
      data
    }
  }`