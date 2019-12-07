export const updateRegistrationFlag = `mutation updateRegistrationFlag(
    $chefId: String!
    $isRegistrationCompletedYn: Boolean
  ) {
    updateChefProfileByChefId(
      input: {
        chefId: $chefId
        chefProfilePatch: {
          isRegistrationCompletedYn: $isRegistrationCompletedYn
        }
      }
    ) {
      chefProfile {
        isRegistrationCompletedYn
      }
    }
  }
  `

  /*
{
  "chefId": "1e2e76da-3526-4fac-8b65-f31f7b1fc5ea",
  "isRegistrationCompletedYn":  true 
}  */