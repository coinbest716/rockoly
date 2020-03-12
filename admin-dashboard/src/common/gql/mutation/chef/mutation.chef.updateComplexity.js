export const updateComplexityGQLTAG = `mutation updateComplexity(
    $chefProfileExtendedId: String!
    $chefComplexity: JSON
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