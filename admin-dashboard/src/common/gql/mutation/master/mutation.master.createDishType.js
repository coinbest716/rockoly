export const createDishTypeGQLTAG = `mutation createDishTypeMaster(
    $dishTypeName: String!
    $chefId: String
    $customerId:String
  ) {
    createDishTypeMaster(
      input: {
        dishTypeMaster: {
          dishTypeName: $dishTypeName
          dishTypeDesc: $dishTypeName
          isManuallyYn: true
          chefId: $chefId
          customerId: $customerId
        }
      }
    ) {
      dishTypeMaster {
        dishTypeId
        dishTypeName
        dishTypeDesc
        isManuallyYn
        chefId
        isAdminApprovedYn
        createdAt
        updatedAt
        customerId
      }
    }
  }`;

/*
  {
  "dishTypeName": "Test Dish",
  "chefId": "1e2e76da-3526-4fac-8b65-f31f7b1fc5ea" / null,
  "customerId":"1e2e76da-3526-4fac-8b65-f31f7b1fc5ea" / null,
}
  */
