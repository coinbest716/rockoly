/** @format */

export const ProfileGQLTAG = `subscription chefProfile($chefId: String!) {
  chefProfile(chefId: $chefId) {
    data
  }
}`
