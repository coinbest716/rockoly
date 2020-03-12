export const updateIsEmailVerifiedYnGQLTAG = `mutation updateIsEmailVerifiedYn(
  $chefId: String!
  $isEmailVerifiedYn: Boolean
) {
  updateChefProfileByChefId(
    input: {
      chefId: $chefId
      chefProfilePatch: { isEmailVerifiedYn: $isEmailVerifiedYn }
    }
  ) {
    chefProfile {
      isEmailVerifiedYn
    }
  }
}`

/*
{
  "chefId":"",
  "isEmailVerifiedYn"
}
*/