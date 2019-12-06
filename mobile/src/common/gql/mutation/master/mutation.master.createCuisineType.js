export const createCuisineTypeGQLTAG = `mutation createCuisineTypeMaster(
  $cusineTypeName: String!
  $chefId: String
  $customerId: String
) {
  createCuisineTypeMaster(
    input: {
      cuisineTypeMaster: {
        cusineTypeName: $cusineTypeName
        cuisineTypeDesc: $cusineTypeName
        isManuallyYn: true
        chefId: $chefId
        customerId: $customerId
      }
    }
  ) {
    cuisineTypeMaster {
      cuisineTypeId
      cusineTypeName
      cuisineTypeDesc
      isManuallyYn
      chefId
      customerId
      isAdminApprovedYn
      createdAt
      updatedAt
    }
  }
}
`;

/*
   {
  "cusineTypeName": "",
  "chefId": "",
  "customerId":""
}
   */
