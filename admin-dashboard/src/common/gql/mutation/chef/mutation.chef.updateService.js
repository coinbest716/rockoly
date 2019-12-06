export const updateServiceGQLTAG = `mutation updateService(
    $chefProfileExtendedId: String!
    $chefAdditionalServices: JSON
    $isChefEnabledShoppingLocationYn: Boolean
  ) {
    updateChefProfileExtendedByChefProfileExtendedId(
      input: {
        chefProfileExtendedId: $chefProfileExtendedId
        chefProfileExtendedPatch: {
          chefAdditionalServices: $chefAdditionalServices
          isChefEnabledShoppingLocationYn: $isChefEnabledShoppingLocationYn
        }
      }
    ) {
      chefProfileExtended {
        chefAdditionalServices
        isChefEnabledShoppingLocationYn
      }
    }
  }
  `

  /*
  {
  "chefProfileExtendedId": "",
  "chefAdditionalServices": "",
  "isChefEnabledShoppingLocationYn": true
}
 */