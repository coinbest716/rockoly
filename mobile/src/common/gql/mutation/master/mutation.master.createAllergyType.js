export const createAllergyTypeGQLTAG = `mutation createAllergyTypeMaster(
  $allergyTypeName: String!
  $chefId: String
  $customerId: String
) {
  createAllergyTypeMaster(
    input: {
      allergyTypeMaster: {
        allergyTypeName: $allergyTypeName
        allergyTypeDesc: $allergyTypeName
        isManuallyYn: true
        chefId: $chefId
        customerId: $customerId
      }
    }
  ) {
    allergyTypeMaster {
      allergyTypeId
      allergyTypeName
      allergyTypeDesc
      statusId
      isManuallyYn
      chefId
      customerId
      createdAt
      updatedAt
    }
  }
}`;

/*
  {
  "allergyTypeName": "Test Dish",
  "chefId": "1e2e76da-3526-4fac-8b65-f31f7b1fc5ea" / null,
  "customerId":"1e2e76da-3526-4fac-8b65-f31f7b1fc5ea" / null,
}
  */
