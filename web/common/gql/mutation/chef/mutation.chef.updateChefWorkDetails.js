export const updateChefWorkDetailsGQLTAG = `mutation updateChefWorkDetails(
    $chefProfileExtendedId: String!
    $chefDesc: String
    $chefSpecializationId: String!
    $chefCuisineTypeId: [String]
  ) {
    updateChefProfileExtendedByChefProfileExtendedId(
      input: {
        chefProfileExtendedId: $chefProfileExtendedId
        chefProfileExtendedPatch: { chefDesc: $chefDesc }
      }
    ) {
      chefProfileExtended {
        chefDesc
      }
    }
    updateChefSpecializationProfileByChefSpecializationId(
      input: {
        chefSpecializationId: $chefSpecializationId
        chefSpecializationProfilePatch: { chefCuisineTypeId: $chefCuisineTypeId }
      }
    ) {
      chefSpecializationProfile {
        chefCuisineTypeId
      }
    }
  }
  `

  /*
  {
  "chefProfileExtendedId": "",
  "chefDesc": "",
  "chefSpecializationId": "",
  "chefCuisineTypeId": ""
}
 */