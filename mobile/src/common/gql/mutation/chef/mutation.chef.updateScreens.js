export const updateScreensGQLTAG = `mutation updateRegistrationFlag(
    $chefId: String!
    $chefUpdatedScreens: [String]
  ) {
    updateChefProfileByChefId(
      input: {
        chefId: $chefId
        chefProfilePatch: {
          chefUpdatedScreens: $chefUpdatedScreens
        }
      }
    ) {
      chefProfile {
        chefUpdatedScreens
      }
    }
  }`

  /*
  {
  "chefId": "",
  "chefUpdatedScreens": ""
} */