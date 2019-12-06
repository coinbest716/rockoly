export const updateSpecializationGQLTAG = `mutation updateChefSpecializationProfileByChefSpecializationId(
  $chefSpecializationId: String!
  $chefCuisineTypeId: [String]
  $chefDishTypeId: [String]
  $ingredientsDesc: JSON
) {
  updateChefSpecializationProfileByChefSpecializationId(
    input: {
      chefSpecializationId: $chefSpecializationId
      chefSpecializationProfilePatch: {
        chefCuisineTypeId: $chefCuisineTypeId
        chefDishTypeId: $chefDishTypeId
        ingredientsDesc: $ingredientsDesc
      }
    }
  ) {
    chefSpecializationProfile {
      chefCuisineTypeId
      chefDishTypeId
      chefCuisineTypeDesc
      chefDishTypeDesc
      ingredientsDesc
    }
  }
}

  `;

/*
{
  "chefSpecializationId": "0a5319d9-9e7a-4247-a85e-99ed8d56371d",
  "chefCuisineTypeId": ["LATVIAN_FOOD                        "],
  "chefDishTypeId": ["TWINKIES                            "]
}
*/