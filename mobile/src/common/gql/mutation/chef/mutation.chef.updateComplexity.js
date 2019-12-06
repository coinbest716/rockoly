export const updateComplexityGQLTAG = `mutation updateComplexity(
    $chefProfileExtendedId: String!
    $chefComplexity: Float
  ) {
    updateChefProfileExtendedByChefProfileExtendedId(
      input: {
        chefProfileExtendedId: $chefProfileExtendedId
        chefProfileExtendedPatch: { chefComplexity: $chefComplexity }
      }
    ) {
      chefProfileExtended {
        chefComplexity
      }
    }
  }`


  /*
  {
  "chefProfileExtendedId": "",
  "chefComplexity": 2.5
} */