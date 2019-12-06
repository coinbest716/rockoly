export const availabilityGQLTAG = `subscription chefAvailabilityProfile($chefId: String!) {
    chefAvailabilityProfile(chefId: $chefId) {
      data
    }
  }`