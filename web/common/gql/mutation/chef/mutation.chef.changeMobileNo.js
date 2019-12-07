export const changeMobileNoGQLTag = `mutation updateChefProfileByChefId(
  $chefId: String!
  $chefMobileNumber: String!
  $chefMobileCountryCode:String
) {
  updateChefProfileByChefId(
    input: {
      chefId: $chefId
      chefProfilePatch: {
        chefMobileCountryCode: $chefMobileCountryCode
        chefMobileNumber: $chefMobileNumber
      }
    }
  ) {
    chefProfile {
      chefId
      fullName
      chefMobileNumber
      chefMobileCountryCode
    }
  }
}
`;

/*
{
  "chefMobileCountryCode": "+91",
 "chefMobileNumber":"92354",
 "chefId":"07fe580f-416c-4125-b6a3-6a0aa589a1ad"
}
*/