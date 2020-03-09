export const updateIsMobileNoVerifiedYnGQLTAG = `mutation updateIsMobileNoVerifiedYn(
  $chefId: String!
  $isMobileNoVerifiedYn: Boolean
) {
  updateChefProfileByChefId(
    input: {
      chefId: $chefId
      chefProfilePatch: { isMobileNoVerifiedYn: $isMobileNoVerifiedYn }
    }
  ) {
    chefProfile {
      isMobileNoVerifiedYn
    }
  }
}`

/*
{
  "chefId":"",
  "isMobileNoVerifiedYn"
}
*/