export const createDietaryRestrictionsTypeGQLTAG = `mutation createDietaryRestrictionsTypeMaster(
  $dietaryRestrictionsTypeName: String!
  $chefId: String
  $customerId: String
) {
  createDietaryRestrictionsTypeMaster(
    input: {
      dietaryRestrictionsTypeMaster: {
        dietaryRestrictionsTypeName: $dietaryRestrictionsTypeName
        dietaryRestrictionsTypeDesc: $dietaryRestrictionsTypeName
        isManuallyYn: true
        chefId: $chefId
        customerId: $customerId
      }
    }
  ) {
    dietaryRestrictionsTypeMaster {
      dietaryRestrictionsTypeId
      dietaryRestrictionsTypeName
      dietaryRestrictionsTypeDesc
      statusId
      isManuallyYn
      chefId
      customerId
      createdAt
      updatedAt
    }
  }
}
`;

/*
  {
  "dietaryRestrictionsTypeName": "Test Dish",
  "chefId": "1e2e76da-3526-4fac-8b65-f31f7b1fc5ea" / null,
  "customerId":"1e2e76da-3526-4fac-8b65-f31f7b1fc5ea" / null,
}
  */
